@echo off
REM =============================================================================
REM API curls — Windows CMD
REM Usage:
REM   cd server\api
REM   api-curl.cmd login
REM   api-curl.cmd articles
REM   api-curl.cmd contact
REM
REM Domain: set DOMAIN=https://example.com
REM Cookies: .\cookies.txt (login je naplní, další session requesty je použijí)
REM =============================================================================

setlocal EnableExtensions
if "%DOMAIN%"=="" set "DOMAIN=http://localhost:3000"
set "COOKIE=%~dp0cookies.txt"
set "LOCALE=cs"

if "%~1"=="" goto :help

call :%~1 %*
if errorlevel 1 (
  echo Unknown command: %~1
  goto :help
)
exit /b 0

:help
echo.
echo DOMAIN=%DOMAIN%
echo.
echo Commands:
echo   login ^| logout ^| articles ^| article ^| messages ^| contact ^| languages ^| authors ^| media ^| slug
echo.
echo Examples:
echo   set DOMAIN=http://localhost:3000
echo   api-curl.cmd login
echo   api-curl.cmd articles
echo   api-curl.cmd contact
echo.
exit /b 0

:login
curl -sS -c "%COOKIE%" -b "%COOKIE%" ^
  -X POST "%DOMAIN%/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@example.com\",\"password\":\"secret\"}"
echo.
exit /b 0

:logout
curl -sS -c "%COOKIE%" -b "%COOKIE%" ^
  -X POST "%DOMAIN%/api/auth/logout"
echo.
exit /b 0

:articles
curl -sS ^
  "%DOMAIN%/api/articles?page=1&limit=10&sort=-publishedAt&isPublished=true&with=author&locale=%LOCALE%"
echo.
exit /b 0

:article
if "%~2"=="" (
  echo Usage: api-curl.cmd article ^<slug^>
  exit /b 1
)
curl -sS "%DOMAIN%/api/articles/%~2?locale=%LOCALE%&with=author"
echo.
exit /b 0

:messages
curl -sS -c "%COOKIE%" -b "%COOKIE%" ^
  "%DOMAIN%/api/messages?page=1&limit=10&sort=-createdAt"
echo.
exit /b 0

:contact
REM Needs a real reCAPTCHA token from the client.
curl -sS ^
  -X POST "%DOMAIN%/api/messages" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Jan\",\"email\":\"jan@example.com\",\"message\":\"Test z CMD\",\"gdpr\":true,\"recaptchaToken\":\"REPLACE_RECAPTCHA_TOKEN\"}"
echo.
exit /b 0

:languages
curl -sS "%DOMAIN%/api/languages/options"
echo.
exit /b 0

:authors
curl -sS -c "%COOKIE%" -b "%COOKIE%" "%DOMAIN%/api/authors"
echo.
exit /b 0

:media
if "%~2"=="" (
  echo Usage: api-curl.cmd media ^<modelId^>
  exit /b 1
)
curl -sS -c "%COOKIE%" -b "%COOKIE%" ^
  "%DOMAIN%/api/media?entity=article&modelId=%~2&grouped=1"
echo.
exit /b 0

:slug
if "%~2"=="" (
  echo Usage: api-curl.cmd slug ^<slug^>
  exit /b 1
)
curl -sS "%DOMAIN%/api/slugs/article/%~2"
echo.
exit /b 0
