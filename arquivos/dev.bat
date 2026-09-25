@echo off
REM ============================================================
REM  dev.bat - Servidor de Desenvolvimento Local - my-piano
REM  Inicia o Vite em modo dev com HMR (hot reload)
REM  Uso: duplo-clique ou execute no cmd a partir de qualquer pasta
REM ============================================================

SET "PROJECT_DIR=%~dp0.."
SET "VITE=node node_modules\vite\bin\vite.js"

echo.
echo  ============================================================
echo   my-piano - Servidor de Desenvolvimento Local
echo  ============================================================
echo   Pasta do projeto : %PROJECT_DIR%
echo   URL local        : http://localhost:5173
echo  ============================================================
echo.
echo  Pressione Ctrl+C para encerrar o servidor.
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

echo [INFO] Iniciando servidor Vite...
echo.
call %VITE%
