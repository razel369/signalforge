@echo off
setlocal enabledelayedexpansion
set URL=https://signalforge-tau-three.vercel.app
for %%P in ( / /dashboard /michrazim /michrazim/%%D7%%AA%%D7%%9C-%%D7%%90%%D7%%91%%D7%%99%%D7%%91 /michrazim/niche/mischar /sitemap.xml /robots.txt /api/signals /api/health ) do (
  for /f "tokens=*" %%S in ('curl -sS -o NUL -w "%%{http_code} time=%%{time_total}" --max-time 60 %URL%%%P 2^>^&1') do (
    echo %%P -> %%S
  )
)