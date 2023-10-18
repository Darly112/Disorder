import React, { useState, useEffect } from 'react';

const palabrasIniciales = ['Pavos', 'Soñar', 'Mango', 'Panda', 'Razer'];
const vidasIniciales = 3;

export function Game() {
  const [palabrasOriginales, setPalabrasOriginales] = useState(palabrasIniciales);
  const [indiceActual, setIndiceActual] = useState(0);
  const palabraOriginal = palabrasOriginales[indiceActual];
  const [palabraDesordenada, setPalabraDesordenada] = useState('');
  const [valoresEntrada, setValoresEntrada] = useState(Array(palabraOriginal.length).fill(''));
  const [indiceEntradaActual, setIndiceEntradaActual] = useState(0);
  const [vidas, setVidas] = useState(vidasIniciales);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    function desordenarPalabra() {
      let palabraDesordenada = palabraOriginal;
      while (palabraDesordenada === palabraOriginal) {
        palabraDesordenada = palabraOriginal.split('').sort(() => Math.random() - 0.5).join('');
      }
      setPalabraDesordenada(palabraDesordenada);
    }
    desordenarPalabra();
  }, [palabraOriginal]);

  const manejarCambioEntrada = (event) => {
    const valorActual = event.target.value;
    const valoresEntradaActualizados = [...valoresEntrada];
    valoresEntradaActualizados[indiceEntradaActual] = valorActual;
    setValoresEntrada(valoresEntradaActualizados);

    if (valorActual === palabraOriginal[indiceEntradaActual]) {
      if (indiceEntradaActual === palabraOriginal.length - 1) {
        // Adivinó la palabra, pasa a la siguiente
        setMensaje(`¡Correcto! La palabra es ${palabraOriginal}`);
        const nuevasPalabras = palabrasOriginales.filter((palabra) => palabra !== palabraOriginal);
        setPalabrasOriginales(nuevasPalabras);

        if (nuevasPalabras.length > 0) {
          const nuevoIndice = Math.floor(Math.random() * nuevasPalabras.length);
          setIndiceActual(nuevoIndice);
          setPalabraOriginal(nuevasPalabras[nuevoIndice]);
          setIndiceEntradaActual(0);
          setValoresEntrada(Array(nuevasPalabras[nuevoIndice].length).fill(''));
          setMensaje('');
        } else {
          setMensaje('¡Felicidades, Adivinaste todas las palabras!');
        }
      } else {
        setIndiceEntradaActual(indiceEntradaActual + 1);
        setMensaje('¡Letra correcta! Siguiente letra.');

        // Avanzar automáticamente al siguiente recuadro
        setTimeout(() => {
          if (indiceEntradaActual < palabraOriginal.length) {
            document.getElementById(`entrada-${indiceEntradaActual + 1}`).focus();
          }
        }, 500);
      }
    } else {
      setVidas(vidas - 1);
      setMensaje(vidas > 1 ? 'Intenta de nuevo. Letra incorrecta.' : '¡Perdiste!');
    }
  };

  const manejarEliminar = () => {
    if (vidas > 0) {
      const valoresEntradaActualizados = [...valoresEntrada];
      valoresEntradaActualizados[indiceEntradaActual] = ''; // Elimina la letra
      setValoresEntrada(valoresEntradaActualizados);
    }
  };

  const manejarReiniciar = () => {
    if (vidas === 0) {
      setVidas(vidasIniciales);
      setMensaje('');
    }
    const nuevoIndice = Math.floor(Math.random() * palabrasOriginales.length);
    setIndiceActual(nuevoIndice);
    setPalabraOriginal(palabrasOriginales[nuevoIndice]);
    setIndiceEntradaActual(0);
    setValoresEntrada(Array(palabrasOriginales[nuevoIndice].length).fill(''));
    desordenarPalabra();
  };

  const cuadrosEntrada = valoresEntrada.map((valor, indice) => (
    <div key={indice} className="flex flex-col-reverse items-center justify-center mb-2">
      <input
        type="text"
        value={valor}
        onChange={manejarCambioEntrada}
        disabled={indice !== indiceEntradaActual || vidas === 0}
        className='w-16 h-16 text-center border-2 border-gray-500 rounded-md text-xl bg-green-100'
        id={`entrada-${indice}`}
      />
      {indice === indiceEntradaActual && vidas > 0 && valor === palabraOriginal[indiceEntradaActual] && (
        <div className="w-16 h-4 bg-green-500 rounded-md" />
      )}
    </div>
  ));

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500'>
      <h1 className='text-2xl font-bold text-white mb-5'>ADIVINA LA PALABRA</h1>
      <div className='flex flex-row items-center justify-center w-full mb-5 space-x-10'>
        <p className='p-4 font-semibold text-white rounded-md bg-green-500'>PALABRA EN DESORDEN: {palabraDesordenada}</p>
        <p className='p-4 font-semibold text-white rounded-md bg-green-500'>VIDAS: {vidas}</p>
      </div>
      <div className="flex flex-row items-center justify-center mb-5">
        {cuadrosEntrada}
      </div>
      <button onClick={manejarReiniciar} className={`p-4 ${vidas === 0 ? 'bg-green-500' : 'bg-blue-500'} text-white rounded-md hover:bg-opacity-90`}>
        {vidas === 0 ? 'Jugar de nuevo' : 'RESET'}
      </button>
      <p className='mt-5 text-2xl text-white'>{mensaje}</p>
    </div>
  );
}
