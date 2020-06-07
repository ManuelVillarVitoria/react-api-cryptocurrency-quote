import React, {useState, useEffect} from 'react';
import Error from './Error'
import styled from '@emotion/styled';
import axios from 'axios';

import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda';

const Boton = styled.input `
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;

    &:hover {
        background-color: #326AC0;
        cursor: pointer;
    }
`;

const Formulario = ({guardarCriptomoneda, guardarMoneda}) => {

    //State del listado de Criptomonedas
    const [listacripto, guardarCriptomonedas] = useState([]);
    const [error, guardarError] = useState(false);

    const MONEDAS = [
        {codigo: 'USD', nombre: 'Dolar de Estados Unidos'},
        {codigo: 'MXN', nombre: 'Peso Mexicano'},
        {codigo: 'EUR', nombre: 'Euro'},
        {codigo: 'GBP', nombre: 'Libra Esterlina'}
    ]

    //utilizar Custom Hook useMoneda
    //Lo importante es poner el mismo orden para el destructuring, 
    //si cambiamos los nombres da igual.
    const [moneda, SelectMonedas] = useMoneda('Elige tu moneda', '', MONEDAS);

    //utilizar Custom Hook useCriptomoneda
    const [criptomoneda, SelectCripto] = useCriptomoneda('Elige tu Criptomoneda', '', listacripto);

    //Ejecutar llamado a la API
    useEffect(() => {

        const consultarAPI = async () => {
            //https://min-api.cryptocompare.com/documentation?key=Toplists&cat=TopTotalMktCapEndpointFull
            //Para que nos de la API las 10 criptomonedas más importantes para mostrarlas en el Select
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

            const res = await axios(url);

            guardarCriptomonedas(res.data.Data);
        }

        consultarAPI();
    },[]);

    //Cuando el usuario hace Submit
    const cotizarMoneda = e => {
        e.preventDefault();

        //Validar si ambos campos están vacíos
        if(moneda === '' || criptomoneda === '') {
            guardarError(true);
            return;
        }
        
        //pasar los datos al componente principal
        guardarError(false);
        guardarCriptomoneda(criptomoneda);
        guardarMoneda(moneda);
    }


    return ( 
        <form
            onSubmit={cotizarMoneda}
        >
            {error ? <Error mensaje="Todos los campos son obligatorios"/> : null}

            <SelectMonedas />

            <SelectCripto />

            <Boton
                type="submit"
                value="Calcular"
             />
        </form>
     );
}
 
export default Formulario;