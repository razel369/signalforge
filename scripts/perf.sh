@echo off
echo LANDING-COLD:
curl -sS -o NUL -w "  status=%{http_code}  time=%{time_total}s  size=%{size_download}b\n" --max-time 60 http://localhost:3004/
echo LANDING-WARM:
curl -sS -o NUL -w "  status=%{http_code}  time=%{time_total}s  size=%{size_download}b\n" --max-time 60 http://localhost:3004/
echo DASHBOARD-COLD:
curl -sS -o NUL -w "  status=%{http_code}  time=%{time_total}s  size=%{size_download}b\n" --max-time 60 http://localhost:3004/dashboard
echo DASHBOARD-WARM:
curl -sS -o NUL -w "  status=%{http_code}  time=%{time_total}s  size=%{size_download}b\n" --max-time 60 http://localhost:3004/dashboard
echo CITY-COLD:
curl -sS -o NUL -w "  status=%{http_code}  time=%{time_total}s  size=%{size_download}b\n" --max-time 60 http://localhost:3004/michrazim/tel-aviv
echo CITY-WARM:
curl -sS -o NUL -w "  status=%{http_code}  time=%{time_total}s  size=%{size_download}b\n" --max-time 60 http://localhost:3004/michrazim/tel-aviv
echo HEALTH:
curl -sS -o NUL -w "  status=%{http_code}  time=%{time_total}s\n" --max-time 60 http://localhost:3004/api/health
echo API:
curl -sS -o NUL -w "  status=%{http_code}  time=%{time_total}s\n" --max-time 60 http://localhost:3004/api/signals