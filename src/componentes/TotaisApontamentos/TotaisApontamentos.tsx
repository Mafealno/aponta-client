import { useEffect, useState } from "react";

import * as utilsTotalTempoTarefa from "../../utils/TempoTotalTarefa";
import Carregando from "../Carregando";
import Paginacao from "../Paginacao";
import { showToast } from "../ToastControl/ToastControl";
import ItemListaTempoTotalTarefa from "./ItemListaTempoTotalTarefa/ItemListaTempoTotalTarefa";

import "./TotaisApontamentos.css";

function TotaisApontamentos() {

    const quantidadePagina = 15;

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [termoFiltro, setTermoFiltro] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [paginacaoDisplay, setPaginacaoDisplay] = useState(<></>)
    const [itensTempoTotalTarefaDisplay, seItensTempoTotalTarefaDisplay] = useState(<></>)
    const [itensTotalTempoTarefa, setItensTotalTempoTarefa] = useState([]);

    useEffect(() => {
        listarTempoTotalTarefaPorUsuario()
    }, [])

    useEffect(() => {
        if(termoFiltro){
            listarTempoTotalTarefaPorTermo(undefined)
        }else{
            listarTempoTotalTarefaPorUsuario()
        }
    }, [paginaAtual])

    const listarTempoTotalTarefaPorUsuario = () => {
        utilsTotalTempoTarefa.listarTempoTotalTarefaPorUsuario(quantidadePagina, paginaAtual)
            .then(response => {
                if(response.status == 200){
                    response.json().then(data => {
                        setItensTotalTempoTarefa(data.listaTempoTotalTarefa)
                        setTotalRegistros(data.total)
                    })
                }
            })
    }

    const listarTempoTotalTarefaPorTermo = (pagina: number | undefined) => {
        utilsTotalTempoTarefa.listarTempoTotalTarefaPorTermo(termoFiltro, quantidadePagina, pagina ?? paginaAtual)
            .then(response => {
                if(response.status == 200){
                    response.json().then(data => {
                        if(data.message){
                            showToast("error", data.message)
                        }else{
                            setItensTotalTempoTarefa(data.listaTempoTotalTarefa)
                            setTotalRegistros(data.total)
                        }
                    })
                }
            })
    }
    
    useEffect(() => {
        montarPaginacao(totalRegistros);
        montarItensTempoTotalTarefa(itensTotalTempoTarefa);
        setCarregando(false);
    }, [itensTotalTempoTarefa])

    const montarPaginacao = (totalRegistros : number) => {
        
        if(totalRegistros){
            if(totalRegistros <= quantidadePagina){
                setPaginacaoDisplay(<></>)
            }else{
                setPaginacaoDisplay(
                    <Paginacao 
                    quantidadePagina={quantidadePagina} 
                    totalRegistros={totalRegistros} 
                    paginaAtual={(paginaSelecionada : number) => setPaginaAtual(paginaSelecionada)}
                    setCarregando={(bool : boolean) => setCarregando(bool)}
                    />)
            }
        }
    }

    const montarItensTempoTotalTarefa = (itensTotalTempoTarefa : any) =>{
        if(itensTotalTempoTarefa){
            seItensTempoTotalTarefaDisplay(itensTotalTempoTarefa.map((item : any) => (
                <ItemListaTempoTotalTarefa key={item.ID} {...item}/>
            )))
        }
    }

  return (
    <div id="container-totais-apontamentos">
        <div id="busca-totais-apontamentos">
            <input 
            type="text"
            className="form-control"
            name="pesquisaTarefa"
            placeholder="Filtre a tarefa ou cliente"
            value={termoFiltro}
            onChange={event => setTermoFiltro(event.target.value)}
            onKeyDown={(event) => event.key == "Enter" ? listarTempoTotalTarefaPorTermo(0) : ""}
            />
        </div>
        <div id="itens-totais-apontamentos">
            {carregando && <Carregando />}
            {!carregando && itensTempoTotalTarefaDisplay}
        </div>
        <div id="paginacao-totais-apontamentos">
            {paginacaoDisplay}
        </div>
    </div>
  )
}

export default TotaisApontamentos;
