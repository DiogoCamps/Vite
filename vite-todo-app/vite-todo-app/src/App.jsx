import React, { useState, useEffect } from "react";
import "./App.css";

// Componente principal da Calculadora
function App() {
  // --- ESTADOS (State) ---
  // Estado para armazenar o valor exibido na tela da calculadora
  const [display, setDisplay] = useState("");
  // Estado para controlar o tema (claro ou escuro)
  const [theme, setTheme] = useState("dark"); // Começa no modo escuro por padrão

  // --- FUNÇÕES ---

  /**
   * Função para avaliar uma expressão matemática de forma segura.
   * Substitui o uso do `eval()` que é inseguro.
   * @param {string} expression - A expressão a ser calculada.
   * @returns {number} - O resultado do cálculo.
   */
  const evaluate = (expression) => {
    // Remove caracteres que não são números, operadores, ou pontos para segurança.
    const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, "");
    // Usa o construtor Function para avaliar a expressão em um escopo controlado.
    // É uma alternativa mais segura que o eval().
    return new Function("return " + sanitizedExpression)();
  };

  /**
   * Adiciona um valor (número ou operador) à expressão no display.
   * @param {string} value - O valor a ser adicionado.
   */
  const handleInput = (value) => {
    // Se houver uma mensagem de erro, limpa antes de adicionar novo valor
    if (display === "Erro" || display === "Não pode dividir por zero") {
      setDisplay(value);
    } else {
      setDisplay((prev) => prev + value);
    }
  };

  /**
   * Limpa o display da calculadora.
   */
  const clearDisplay = () => {
    setDisplay("");
  };

  /**
   * Calcula o resultado da expressão no display.
   */
  const calculateResult = () => {
    // Verifica se há uma tentativa de divisão por zero
    if (display.includes("/0")) {
      setDisplay("Não pode dividir por zero");
      return;
    }
    try {
      // Tenta calcular a expressão e atualiza o display com o resultado
      const result = evaluate(display);
      setDisplay(result.toString());
    } catch {
      // Se ocorrer um erro na avaliação, mostra a mensagem "Erro"
      setDisplay("Erro");
    }
  };

  /**
   * Calcula a porcentagem do número atual no display.
   */
  const handlePercentage = () => {
    try {
      const currentValue = parseFloat(display);
      if (!isNaN(currentValue)) {
        setDisplay((currentValue / 100).toString());
      }
    } catch {
      setDisplay("Erro");
    }
  };

  /**
   * Alterna entre o tema claro e escuro.
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // --- EFEITOS (useEffect) ---

  /**
   * Efeito para adicionar e remover o listener de eventos do teclado.
   * Permite que o usuário digite usando o teclado físico.
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (/[0-9]/.test(key)) {
        // Números de 0 a 9
        handleInput(key);
      } else if (["+", "-", "*", "/"].includes(key)) {
        // Operadores
        handleInput(key);
      } else if (key === ".") {
        // Ponto decimal
        handleInput(".");
      } else if (key === "%") {
        // Porcentagem
        handlePercentage();
      } else if (key === "Enter" || key === "=") {
        // Calcular resultado
        event.preventDefault(); // Previne o comportamento padrão do Enter
        calculateResult();
      } else if (key === "Backspace") {
        // Apagar último caractere
        setDisplay((prev) => prev.slice(0, -1));
      } else if (key === "Escape" || key.toLowerCase() === "c") {
        // Limpar display
        clearDisplay();
      }
    };

    // Adiciona o listener quando o componente é montado
    window.addEventListener("keydown", handleKeyDown);

    // Remove o listener quando o componente é desmontado para evitar vazamento de memória
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [display]); // A dependência [display] garante que as funções dentro do efeito usem o estado mais atual

  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <div className={`calculator ${theme}`}>
      <div className="header">
        <button className="toggle-theme" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      <input
        type="text"
        value={display}
        readOnly // O input é somente leitura para forçar o uso dos botões/teclado
        className="display"
      />

      <div className="buttons">
        {/* Usando grid para melhor responsividade */}
        <button onClick={clearDisplay} className="operator">
          C
        </button>
        <button onClick={handlePercentage} className="operator">
          %
        </button>
        <button onClick={() => handleInput("/")} className="operator">
          /
        </button>
        <button onClick={() => handleInput("*")} className="operator">
          *
        </button>

        <button onClick={() => handleInput("7")}>7</button>
        <button onClick={() => handleInput("8")}>8</button>
        <button onClick={() => handleInput("9")}>9</button>
        <button onClick={() => handleInput("-")} className="operator">
          -
        </button>

        <button onClick={() => handleInput("4")}>4</button>
        <button onClick={() => handleInput("5")}>5</button>
        <button onClick={() => handleInput("6")}>6</button>
        <button onClick={() => handleInput("+")} className="operator">
          +
        </button>

        <button onClick={() => handleInput("1")}>1</button>
        <button onClick={() => handleInput("2")}>2</button>
        <button onClick={() => handleInput("3")}>3</button>
        <button onClick={calculateResult} className="equals">
          =
        </button>

        <button onClick={() => handleInput("0")} className="zero">
          0
        </button>
        <button onClick={() => handleInput(".")}>.</button>
      </div>
    </div>
  );
}

export default App;
