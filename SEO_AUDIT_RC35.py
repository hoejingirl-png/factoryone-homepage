from pathlib import Path
import re
root=Path(__file__).parent
files=list(root.rglob("*.html"))
issues=[]
indexable=0
for p in files:
 s=p.read_text(encoding="utf-8",errors="ignore")
 rel=p.relative_to(root)
 noindex='name="robots"' in s and 'noindex' in s
 if not noindex:
  indexable+=1
  titles=re.findall(r"<title>.*?</title>",s,re.I|re.S)
  desc=re.findall(r'<meta\s+name=["\']description["\'][^>]*>',s,re.I)
  can=re.findall(r'<link\s+rel=["\']canonical["\'][^>]*>',s,re.I)
  h1=re.findall(r"<h1\b",s,re.I)
  if len(titles)!=1: issues.append((str(rel),"title",len(titles)))
  if len(desc)!=1: issues.append((str(rel),"description",len(desc)))
  if len(can)!=1: issues.append((str(rel),"canonical",len(can)))
  if len(h1)!=1: issues.append((str(rel),"h1",len(h1)))
print("HTML:",len(files),"INDEXABLE:",indexable,"ISSUES:",len(issues))
for x in issues[:100]: print(*x)
