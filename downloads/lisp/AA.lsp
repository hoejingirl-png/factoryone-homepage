;; [AA] CADFactory 고도값 일괄 보정 V3.0
;; AutoCAD 2008~2025 호환 안정화판
;; 명령어: AA
;; 기능:
;; - TEXT/MTEXT 숫자 고도값 보정
;; - POINT / LINE / LWPOLYLINE / POLYLINE 고도값 보정
;; - 기존 레이어 유지
;; - 색상 표시 옵션: 기존색상 유지 또는 오렌지색(30) 마킹
;; - Z값 누락 객체 방어
;; - UndoMark / 오류 복구 안정화

(vl-load-com)

(if (not *AA_MARK_ORANGE*) (setq *AA_MARK_ORANGE* "N"))

(defun aa-z (pt)
  (if (and pt (caddr pt))
    (caddr pt)
    0.0
  )
)

(defun aa-pt3 (pt dz)
  (list
    (car pt)
    (cadr pt)
    (+ (aa-z pt) dz)
  )
)

(defun aa-safe-put-color (obj col)
  (if obj
    (vl-catch-all-apply
      '(lambda ()
         (vla-put-color obj col)
       )
    )
  )
)

(defun aa-safe-end-undo (doc)
  (if doc
    (vl-catch-all-apply
      '(lambda ()
         (vla-EndUndoMark doc)
       )
    )
  )
)

(defun aa-update-lwpoly-elev (edata offset / oldpair oldval)
  (setq oldpair (assoc 38 edata))
  (setq oldval (if oldpair (cdr oldpair) 0.0))
  (if oldpair
    (subst (cons 38 (+ oldval offset)) oldpair edata)
    (append edata (list (cons 38 (+ oldval offset))))
  )
)

(defun aa-update-polyline-vertices (ent offset / v ed pt cnt)
  ;; 3D POLYLINE / 구형 POLYLINE 정점 직접 순회 방식
  ;; vlax Coordinates 변경보다 구버전 안정성이 높음
  (setq cnt 0)
  (setq v (entnext ent))
  (while v
    (setq ed (entget v))
    (cond
      ((= (cdr (assoc 0 ed)) "VERTEX")
       (setq pt (cdr (assoc 10 ed)))
       (if pt
         (progn
           (setq ed (subst (cons 10 (aa-pt3 pt offset)) (assoc 10 ed) ed))
           (entmod ed)
           (setq cnt (1+ cnt))
         )
       )
      )
      ((= (cdr (assoc 0 ed)) "SEQEND")
       (setq v nil)
      )
    )
    (if v (setq v (entnext v)))
  )
  cnt
)

(defun c:AA
  (
    /
    offset ss i ent edata etype old_pt new_pt old_val new_val old_str new_str
    doc old_error old_dimzin obj p1 p2 markOpt changed skipped msg
  )

  (setq doc (vla-get-activedocument (vlax-get-acad-object)))
  (setq old_error *error*)
  (setq old_dimzin (getvar "DIMZIN"))

  (defun *error* (msg)
    (if old_dimzin (setvar "DIMZIN" old_dimzin))
    (aa-safe-end-undo doc)
    (setq *error* old_error)
    (if (and msg (not (wcmatch (strcase msg t) "*break*,*cancel*,*exit*")))
      (princ (strcat "\n◆ CADFactory\n[AA 오류] " msg))
    )
    (princ)
  )

  (vl-catch-all-apply
    '(lambda ()
       (vla-StartUndoMark doc)
     )
  )

  (setvar "DIMZIN" 0)

  (princ "\n────────────────────────")
  (princ "\n◆ CADFactory | AA 고도값 일괄 보정센터")
  (princ "\nProfessional CAD Solution")
  (princ "\n────────────────────────")
  (princ "\n[1/3] 보정할 고도 오차값을 입력하세요.")
  (setq offset (getreal "\n▶ 고도 오차값 입력 (예: -0.200): "))
  (if (not offset)
    (progn
      (princ "\n◆ CADFactory\n작업이 취소되었습니다.")
      (*error* "Cancel")
      (exit)
    )
  )

  (princ "\n[2/3] 변경 객체 표시 방식을 선택하세요.")
  (initget "Yes No")
  (setq markOpt
    (getkword
      (strcat
        "\n▶ 오렌지색 표시 [Yes/No] <"
        (if (= *AA_MARK_ORANGE* "Y") "Yes" "No")
        ">: "
      )
    )
  )
  (if markOpt
    (setq *AA_MARK_ORANGE* (if (= markOpt "Yes") "Y" "N"))
  )

  (princ
    (strcat
      "\n[3/3] 고도값을 보정할 객체를 선택하세요."
      (if (= *AA_MARK_ORANGE* "Y")
        "\n▶ 변경 후 오렌지색으로 표시합니다."
        "\n▶ 기존 레이어/색상을 유지합니다."
      )
    )
  )

  (setq ss (ssget '((0 . "TEXT,MTEXT,POINT,LINE,LWPOLYLINE,POLYLINE"))))

  (setq changed 0)
  (setq skipped 0)

  (if ss
    (progn
      (setq i 0)
      (repeat (sslength ss)
        (setq ent (ssname ss i))
        (setq edata (entget ent))
        (setq etype (cdr (assoc 0 edata)))
        (setq obj (vl-catch-all-apply '(lambda () (vlax-ename->vla-object ent))))

        (if (vl-catch-all-error-p obj) (setq obj nil))

        (cond
          ;; A. 텍스트 처리: 숫자면 문자값 보정 + 삽입점 Z 보정
          ((or (= etype "TEXT") (= etype "MTEXT"))
           (setq old_str (cdr (assoc 1 edata)))
           (setq old_val (distof old_str))
           (setq old_pt (cdr (assoc 10 edata)))
           (if (and old_val old_pt)
             (progn
               (setq new_val (+ old_val offset))
               (setq new_str (rtos new_val 2 3))
               (setq new_pt (aa-pt3 old_pt offset))
               (setq edata (subst (cons 1 new_str) (assoc 1 edata) edata))
               (setq edata (subst (cons 10 new_pt) (assoc 10 edata) edata))
               (entmod edata)
               (if (= *AA_MARK_ORANGE* "Y") (aa-safe-put-color obj 30))
               (setq changed (1+ changed))
             )
             (setq skipped (1+ skipped))
           )
          )

          ;; B. 포인트 처리
          ((= etype "POINT")
           (setq old_pt (cdr (assoc 10 edata)))
           (if old_pt
             (progn
               (setq new_pt (aa-pt3 old_pt offset))
               (setq edata (subst (cons 10 new_pt) (assoc 10 edata) edata))
               (entmod edata)
               (if (= *AA_MARK_ORANGE* "Y") (aa-safe-put-color obj 30))
               (setq changed (1+ changed))
             )
             (setq skipped (1+ skipped))
           )
          )

          ;; C. 일반 선
          ((= etype "LINE")
           (setq p1 (cdr (assoc 10 edata)))
           (setq p2 (cdr (assoc 11 edata)))
           (if (and p1 p2)
             (progn
               (setq edata (subst (cons 10 (aa-pt3 p1 offset)) (assoc 10 edata) edata))
               (setq edata (subst (cons 11 (aa-pt3 p2 offset)) (assoc 11 edata) edata))
               (entmod edata)
               (if (= *AA_MARK_ORANGE* "Y") (aa-safe-put-color obj 30))
               (setq changed (1+ changed))
             )
             (setq skipped (1+ skipped))
           )
          )

          ;; D. 2D 폴리선: Elevation 38값 보정
          ((= etype "LWPOLYLINE")
           (setq edata (aa-update-lwpoly-elev edata offset))
           (entmod edata)
           (if (= *AA_MARK_ORANGE* "Y") (aa-safe-put-color obj 30))
           (setq changed (1+ changed))
          )

          ;; E. 구형/3D 폴리선: VERTEX 직접 보정
          ((= etype "POLYLINE")
           (if (> (aa-update-polyline-vertices ent offset) 0)
             (progn
               (if (= *AA_MARK_ORANGE* "Y") (aa-safe-put-color obj 30))
               (setq changed (1+ changed))
             )
             (setq skipped (1+ skipped))
           )
          )

          (T
           (setq skipped (1+ skipped))
          )
        )

        (setq i (1+ i))
      )

      (setq msg
        (strcat
          "\n────────────────────────"
          "\n◆ CADFactory"
          "\n작업 완료"
          "\n변경 : " (itoa changed) "개"
          "\n건너뜀 : " (itoa skipped) "개"
          (if (= *AA_MARK_ORANGE* "Y")
            "\n표시 : 오렌지색 적용"
            "\n표시 : 기존 색상 유지"
          )
          "\n────────────────────────"
        )
      )
      (princ msg)
    )
    (princ "\n◆ CADFactory\n객체를 선택하지 않았습니다.")
  )

  (if old_dimzin (setvar "DIMZIN" old_dimzin))
  (aa-safe-end-undo doc)
  (setq *error* old_error)
  (princ)
)

(princ "\n◆ CADFactory | AA 고도값 일괄 보정센터 로드 완료. 명령어: AA")
(princ)
