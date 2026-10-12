@echo off
chcp 65001 >nul
title Simulador Parabroteas sarsi - Estequiometria Ecologica
cls

echo ==============================================================================
echo    SIMULADOR INTERACTIVO: PARABROTEAS SARSI ^& RESTRICCIONES ESTEQUIOMETRICAS
echo    Basado en Balseiro et al. (2022) - Ecologia Austral 32:638-649
echo ==============================================================================
echo.
echo [1/2] Iniciando servidor local en http://localhost:8000 ...
echo.

:: Abrir navegador web tras 1 segundo
start "" "http://localhost:8000"

echo [2/2] Servidor activo. Presiona Ctrl + C en esta ventana para detenerlo.
echo.
echo Abriendo aplicacion en el navegador predeterminado...
echo.

:: Iniciar servidor HTTP de Python en el puerto 8000
python -m http.server 8000

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] El puerto 8000 podria estar ocupado. Intentando en puerto 8080...
    start "" "http://localhost:8080"
    python -m http.server 8080
)

pause
