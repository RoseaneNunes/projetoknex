import { useState } from "react";
import { isEmpty } from "lodash";
import validator from 'validator'
import QRCode, { QRCodeSVG } from 'qrcode.react';
import React from 'react';
import { form } from "framer-motion/client";
import { CgMail } from "react-icons/cg";





const BadForm = () => {

  function gerarIDPixComTimestamp() {
  const timestamp = Date.now().toString(36); // Timestamp em base 36 para reduzir o tamanho
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let aleatorio = '';

  for (let i = 0; i < 20; i++) { // Gera os caracteres restantes para atingir 32 no total
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    aleatorio += caracteres.charAt(indiceAleatorio);
  }

  return `${timestamp}${aleatorio}`.slice(0, 32); // Garante exatamente 32 caracteres
}

  
  function gerarPayloadPix({ chave, nome, cidade, valor, identificador }) {
    function formatarValor(valor) {
      return valor.toFixed(2).replace('.', '');
    }
    function calcularCRC16(payload) {
      let polinomio = 0x1021;
      let resultado = 0xFFFF;
  
      for (let i = 0; i < payload.length; i++) {
        resultado ^= payload.charCodeAt(i) << 8;
  
        for (let j = 0; j < 8; j++) {
          if ((resultado & 0x8000) !== 0) {
            resultado = (resultado << 1) ^ polinomio;
          } else {
            resultado <<= 1;
          }
        }
      }
  
      return (resultado & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }
  
  
    const payloadSemCRC = [
      '000201', // Início do Payload Pix
    '010212', // Código do tipo de transação (QR Code estático)
    '26', // Merchant Account Information
    `0014BR.GOV.BCB.PIX`, // URL padrão para o Pix
    `01${chave.length}${chave}`, // Chave Pix
    '52040000', // Código do país e da moeda (BRL - Real)
    '5303986', // Moeda: 986 = BRL
    valor > 0 ? `54${formatarValor(valor).length}${formatarValor(valor)}` : '', // Valor da transação (opcional)
    `5802${cidade.length}${cidade}`, // Nome da cidade
    `59${nome.length}${nome}`, // Nome do destinatário
    `62${identificador.length}${identificador}`, // Identificador da transação
    '6304', // Placeholder do Checksum
    ].join('');
  
    const checksum = calcularCRC16(payloadSemCRC);
    return `${payloadSemCRC}${checksum}`;
  }

    const idPix = gerarIDPixComTimestamp();
    const chavePix = "rosenesje2014@gmail.com"; // Insira a chave Pix aqui
    const nomeRecebedor = "Roseane Nunes Dos Anjos";
    const cidadeRecebedor = "São Jose Do egito";
    const [valorTransacao, setValorTransacao] = useState(0.00); // Estado para armazenar o valor da transação
    const identificador = "12345678"; // Identificador único
  
    // Gera o payload do Pix com base nas informações fornecidas
    const payloadPix = gerarPayloadPix({
      chave: chavePix,
      nome: nomeRecebedor,
      cidade: cidadeRecebedor,
      valor: valorTransacao,
      identificador: idPix,
    });

    console.log(payloadPix);

  const [inputValue, setInputValue] = useState("");
  const [email, setEmail] = useState("");
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    telefone: "",
    valor: 0,
    Frequencia: "0",
    Mensagem: "",
   
    
  });

//um evento q revela ou desaparece botoes
  const [isOn, setIsOn] = useState(false);
  const handleToggle = () => {
  setIsOn(prevIsOn => !prevIsOn);
  
};

  const [errors, setErrors] = useState({
    name: null,
    email: null,
    telefone: null,
    valor: null,
    Frequencia: null,
    Mensagem: null,
    
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let formIsValid = true;
    const value = userForm.telefone;
    const nome = userForm.name;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const Vemail = userForm.email;
    setEmail(Vemail)
    setInputValue(nome);
    setInputValue(value);

    if (!emailRegex.test(Vemail)) {
      setErrors((prev) => ({ ...prev, email: "Email Não Valido." }));
      formIsValid = false;
    } else {
      setErrors((prev) => ({ ...prev, email: null }));
    }

    
    if (value.length < 9 && value.length!==0) {
      setErrors((prev) => ({ ...prev, telefone: "Telefone Não é Valido." }));
      formIsValid = false;
    } else {
      setErrors((prev) => ({ ...prev, telefone: null }));
    }

    if (nome.length < 3) {
      setErrors((prev) => ({ ...prev, name: "Nome Não é Valido." }));
      formIsValid = false;
    } else {
      setErrors((prev) => ({ ...prev, name: null }));
    }
    
    if (isEmpty(valorTransacao)) {
      setErrors((prev) => ({ ...prev, valor: "valor não valido" }));
      formIsValid = false;
    } else {
      setErrors((prev) => ({ ...prev, valor: null }));
    }

    if (userForm.Frequencia === "0") {
      setErrors((prev) => ({ ...prev, Frequencia: "Frequencia Não Valida." }));
      formIsValid = false;
    } else {
      setErrors((prev) => ({ ...prev, Frequencia: null }));
    }

    if (!formIsValid) return;

    alert(JSON.stringify(userForm));
  };

  return (

    <div className="app-container">

  
      {!isOn && (
         <div className="form-group">
         <label>Nome</label>
         <input
           className={errors?.name && "input-error"}
           type="text"
           placeholder="Seu nome"
           value={userForm.name}
           minLength={3}
           onChange={(e) =>
             setUserForm((prev) => ({ ...prev, name: e.target.value }))
           }
         />
          <p className="error-message">{errors?.name}</p>
       </div>
          
       
      )}

      {!isOn && (
         <div className="form-group">
         <label>telefone</label>
         <input
           className={errors?.telefone && "input-error"}
           type="texto"
           placeholder="telefone"
           value={userForm.telefone}
           maxLength={11}
           minLength={9}
           onChange={(e) =>
             setUserForm((prev) => ({ ...prev, telefone:e.target.value  }))
           }
         />
         <p className="error-message">{errors?.telefone}</p>    
         
       </div>
       
      )}

      {!isOn && (
        <div className="form-group">
        <label>E-mail</label>
        <input
          className={errors?.email && "input-error"}
          type="email"
          placeholder="Seu e-mail"
          value={userForm.email}
          onChange={(e) =>
            setUserForm((prev) => ({ ...prev, email:e.target.value  }))
          }
        />
        {errors?.email && <p className="error-message">{errors?.email}</p>}

        
      </div>
       
      )}
      {isOn && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1 style ={{color:"white"}}> Pix QR Code</h1>
        <QRCodeSVG
          value={payloadPix} // O link ou texto que você quer embutir no QR Code
          size={156} // Tamanho do QR Code em pixels
          bgColor="#ffffff" // Cor de fundo
          fgColor="#000000" // Cor do QR Code
          level="Q" // Nível de correção de erros (L, M, Q, H)
        />
      </div>
      
          
      )}
      

      {isOn && (
          <div className="form-group">
          <label>valor</label>
          <input
            className={errors?.valorTransacao && "input-error"}
            type="number"
            placeholder="valor maior que R$5,00"
            value={valorTransacao}
            step="0.01"
            min = "5.00"
            max = "10000.00"

            onChange={(e) => setValorTransacao(parseFloat(e.target.value) || 0)} // Atualiza o estado
          />
          {errors?.valor && (
            <p className="error-message">{errors?.valor}</p>
          )}
        </div>
      )}

      {isOn && (
          <div className="form-group">
          <label>Frequencia</label>
          <select
            className={errors?.Frequencia && "input-error"}
            value={userForm.Frequencia}
            onChange={(e) =>
              setUserForm((prev) => ({ ...prev, Frequencia: e.target.value }))
            }
          >
            <option value="0">Selecione a Frequencia...</option>
            <option value="unica">Unica</option>
            <option value="mensal">Mensal</option>
          </select>
  
          {errors?.Frequencia && (
            <p className="error-message">{errors?.Frequencia}</p>
          )}
        </div>
      )}    

      {isOn && (
          <div className="form-group">
          <label>mensagem</label>
          <input
            type="Mensagem"
            placeholder="mensagem"
            value={userForm.Mensagem}
            maxLength={200}
            onChange={(e) =>
              setUserForm((prev) => ({ ...prev, Mensagem: e.target.value }))
            }
          />
          
        </div>
        
      )}

      {isOn && (
          <div className="form-group">
          <button onClick={handleSubmit}>Finalizar doação</button>
        </div>
      )}
       
     

      <div className="form-group">
      <button onClick={handleToggle}>
         {isOn ? "Anterior" : "proximo"}
      </button>
      </div>
      
    </div>

    
    
  );


};

export default BadForm;