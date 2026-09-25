@echo off
REM ============================================================
REM  build.bat - Script de Build do Projeto my-piano
REM  Executa: TypeScript check + tsc -b + Vite build (producao)
REM  Uso: duplo-clique ou execute no cmd a partir de qualquer pasta
REM ============================================================

SET "PROJECT_DIR=%~dp0.."
SET "LOG_FILE=%~dp0build_log.txt"
SET "TSC=node node_modules\typescript\lib\tsc.js"
SET "VITE=node node_modules\vite\bin\vite.js"

echo.
echo  ============================================================
echo   my-piano - Build de Producao
echo  ============================================================
echo   Pasta do projeto : %PROJECT_DIR%
echo   Log              : %LOG_FILE%
echo  ============================================================
echo.

cd /d "%PROJECT_DIR%"
if ERRORLEVEL 1 (
    echo [ERRO] Nao foi possivel acessar: %PROJECT_DIR%
    pause
    exit /b 1
)

REM --- Verifica se o node_modules existe ---
if not exist "node_modules\" (
    echo [INFO] node_modules nao encontrado. Executando npm install...
    echo.
    npm install
    if ERRORLEVEL 1 (
        echo [ERRO] npm install falhou.
        pause
        exit /b 1
    )
)

echo [1/4] Verificando tipos TypeScript ^(--noEmit^)...
echo.
call %TSC% --noEmit
if ERRORLEVEL 1 (
    echo.
    echo [ERRO] Erros de TypeScript encontrados. Corrija antes de prosseguir.
    pause
    exit /b 1
)
echo [OK] TypeScript sem erros.
echo.

echo [2/4] Compilando TypeScript ^(tsc -b^)...
echo.
call %TSC% -b
if ERRORLEVEL 1 (
    echo.
    echo [ERRO] tsc -b falhou.
    pause
    exit /b 1
)
echo [OK] tsc -b concluido.
echo.

echo [3/4] Empacotando com Vite ^(build de producao^)...
echo.
call %VITE% build
if ERRORLEVEL 1 (
    echo.
    echo [ERRO] vite build falhou. Verifique os erros acima.
    pause
    exit /b 1
)
echo.
echo [OK] Build concluido com sucesso!
echo.

echo [4/4] Resultado em: %PROJECT_DIR%\dist\
echo.
dir /b "%PROJECT_DIR%\dist\" 2>nul
echo.
echo  ============================================================
echo   Build finalizado! Arquivos prontos em: dist\
echo  ============================================================
echo.

REM --- Registra o horario no log ---
echo %DATE% %TIME% - Build OK >> "%LOG_FILE%"

pause
