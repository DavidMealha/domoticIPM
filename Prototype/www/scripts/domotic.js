//Made by:
//David Mealha
//Luis Serrano

/**
 * Classe Visualizavel
 */

/**
 * @class Objetos que podem ser colocados nas páginas HTML (implementa todos os aspetos do DOM).
 * @constructs Visualizavel
 * @param {string} etiqueta - nome da etiqueta que representará o objeto.
 *
 * @property {HTMLElement} visualizacao - elemento HTML que será colocado na página
 */
function Visualizavel(etiqueta) {
	if (etiqueta) {
		this.visualizacao = document.createElement(etiqueta);
	}
}

/**
 * Coloca a visualização no elemento HTML da página
 * @param {HTMLElement} elemento - elemento HTML onde será colocada a visualização.
 */
Visualizavel.prototype.apresentar = function (elemento) {
	// Elimina, eventuais, filhos do elemento HTML da página
	while (elemento.hasChildNodes()) {
		elemento.removeChild(elemento.lastChild);
	}

	// Coloca a visualização no elemento HTML da página
	// Verifica tambem se o argumento passado é igual ao this.visualizacao
	// No caso de se criar consolas e compartimentos acontece que precisamos de
	// apagar todos os filhos de uma div e nao fazer append de novo porque é feito
	// noutro sitio
	if (this.visualizacao && !this.visualizacao.isEqualNode(elemento)) {
		elemento.appendChild(this.visualizacao);
	}
};

/**
 * Adiciona um evento on-click ao elemento HTML da visualização
 * @param {string} type - tipo de evento a passar
 * @param {function} clickHandler - função a executar no evento
 */
Visualizavel.prototype.addOnType = function (type, clickHandler) {
	if (this.visualizacao) {
		this.visualizacao.addEventListener(type, clickHandler);
	}
};

/**
 * Função para adicionar um ID ao elemento HTML
 * @param {number} id - ID passado para ser adicionado
 */
Visualizavel.prototype.addId = function (id) {
	this.visualizacao.setAttribute("id", id);
};

/**
 * Classe Input
 */

/**
 * @class Objetos que representam input que podem ser colocados nas páginas HTML (implementa todos os aspetos do DOM).
 * @constructs Input
 * @extends Visualizavel
 *
 */
function Input() {
	Visualizavel.call(this, "input");
}
Input.prototype = Object.create(Visualizavel.prototype);
Input.prototype.constructor = Input;

/**
 * Método para adicionar o tipo de input
 */
Input.prototype.addType = function (type) {
	this.visualizacao.type = type;
};

/**
 * Método para adicionar o value ao input criado
 */
Input.prototype.addValue = function(texto) {
	this.visualizacao.setAttribute("value", texto);
};

/**
 * Classe Imagem
 */

/**
 * @class Uma imagem que será apresentada na página.
 * @constructs Imagem
 * @extends Visualizavel
 *
 * @property {string} ficheiro - nome do ficheiro da imagem a ser apresentada.
 */
var Imagem = (function () {
	/**
	 * Devolve o nome do ficheiro de uma visualização imagem
	 * @returns {string} Nome do ficheiro de imagem
	 * @private
	 */
	function getImagem() {
		return this.visualizacao.src;
	}

	/**
	 * Altera o nome do ficheiro de uma visualização imagem
	 * @param {string} ficheiro - nome do ficheiro de imagem
	 * @private
	 */
	function setImagem(ficheiro) {
		this.visualizacao.src = ficheiro;
	}

	return function Imagem() {
		Visualizavel.call(this, "img");
		Object.defineProperty(this, "ficheiro", {
			enumerable: true,
			configurable: false,
			get: getImagem,
			set: setImagem
		});
	};
}());
Imagem.prototype = Object.create(Visualizavel.prototype);
Imagem.prototype.constructor = Image;

/**
 * Classe Ecra
 */

/**
 * @class Objeto que simula um ecra do sistema, onde são apresentados informação
 * @constructs Ecra
 * @extends Visualizavel
 * @param {string} [titulo] - nomes de um ecrã, este nome será o nome de uma consola, compartimento, etc...
 * @param {string} [subtitulo] - nome do subtitulo de um ecra, por exemplo no ecra do sistema domotico este subtitulo será "Consolas", para indicar a listagem de consolas.
 * @param {Object} [objetoPai] - referência do objeto acima, por exemplo uma consola tem como objeto pai o sistema domotico.
 *
 * @property {string} titulo - nomes de um ecrã, este nome será o nome de uma consola, compartimento, etc....
 * @property {string} subtitulo - nome do subtitulo de um ecra, por exemplo no ecra do sistema domotico este subtitulo será "Consolas", para indicar a listagem de consolas.
 * @property {Object} objetoPai - referência do objeto acima, por exemplo uma consola tem como objeto pai o sistema domotico.
 * @property {Object[]} listaElementos - lista dos elementos contido no ecrã, no caso do sistema domótico seria a lista de consolas.
 * @property {Visualizavel[]} listaBotoes - lista das acções possíveis em cada ecrã, como "criar", "apagar", "voltar", etc...
 */
function Ecra(titulo, subtitulo, objetoPai) {
	Visualizavel.call(this, "div");
	this.addId("elementos-container");
	this.titulo = titulo;
	this.subtitulo = subtitulo;
	this.objectoPai = objetoPai;
	this.listaElementos = [];
	this.listaBotoes = [];
}
Ecra.prototype = Object.create(Visualizavel.prototype);
Ecra.prototype.constructor = Ecra;

/**
 * Redefinição do método apresentar da classe Visualizavel
 * @param {HTMLElement} elemento - elemento HTML onde será colocada a visualização.
 */
Ecra.prototype.apresentar = function (elemento) {
	Visualizavel.prototype.apresentar.call(this, elemento);

	while (this.visualizacao.hasChildNodes()) {
		this.visualizacao.removeChild(this.visualizacao.lastChild);
	}

    //cria <h1> para o titulo
	var tituloHtml = new Visualizavel("h1");
	tituloHtml.visualizacao.textContent = this.titulo;
    this.visualizacao.appendChild(tituloHtml.visualizacao);

    //Se for uma consola ou um compartimento adiciona um input para alterar o nome do mesmo
	if (this instanceof Consola || this instanceof Compartimento) {
		var inputTitulo = new Input();
		inputTitulo.addValue(this.titulo);
		inputTitulo.addOnType("change", this.mudarInput.bind(this, inputTitulo));
		tituloHtml.addOnType("click", function() {
			tituloHtml.visualizacao.style.display = "none";
			inputTitulo.visualizacao.style.display = "block";
		});
        inputTitulo.visualizacao.style.display = "none";
 	    this.visualizacao.appendChild(inputTitulo.visualizacao);
	}

    //adiciona-se o subtitulo à pagina
	var subtituloHtml = document.createElement("h3");
	subtituloHtml.textContent = this.subtitulo;
	this.visualizacao.appendChild(subtituloHtml);

    //criação da lista de elementos
	var ulHtml = document.createElement("ul");
	ulHtml.setAttribute("id", "elementos");

	// ordenar a lista de elementos
	this.listaElementos.sort(function(a, b) {
		if (a.titulo < b.titulo) return -1;
		if (a.titulo > b.titulo) return 1;
		return 0;
	});

    //para cada elemento na lista de elementos
	for (var i = 0, listaElementosLength = this.listaElementos.length; i < listaElementosLength; i++) {
		//adiciona-se uma checkabox
        var inputElemento = new Input();
		inputElemento.addType("checkbox");
		inputElemento.visualizacao.dataset.id = i;

        //cria-se a linha da lista (<li>)
		var elemAux = document.createElement("li");
		if (this instanceof SistemaDomotico || this instanceof Consola) {
			var linkAux = new Visualizavel("a");
			linkAux.visualizacao.textContent = this.listaElementos[i].titulo;
			linkAux.visualizacao.setAttribute("href", "#");
			linkAux.visualizacao.dataset.id = i;
			linkAux.addOnType("click", this.navegar.bind(this, i));

			elemAux.appendChild(linkAux.visualizacao);
			elemAux.insertBefore(inputElemento.visualizacao, elemAux.childNodes[0]);
		} else {
			elemAux.textContent = this.listaElementos[i].titulo;
			elemAux.insertBefore(inputElemento.visualizacao, elemAux.childNodes[0]);
		}
        ulHtml.appendChild(elemAux);
	}

	this.visualizacao.appendChild(ulHtml);
	for (var z = 0, listaBotoesLength = this.listaBotoes.length; z < listaBotoesLength; z++) {
        // verificar se existe algum botao com o texto listar
        // se existir e se for instancia de compartimento, mete como display none
        this.visualizacao.appendChild(this.listaBotoes[z]);
        if (this.listaBotoes[z].textContent === "Listar" && this instanceof Compartimento) {
            this.listaBotoes[z].style.display = "none";
        }
	}

	// necessario para quando estivermos no monitorizar e alterar o titulo, nao apagar os
	// botoes quando se fizer outra vez apresentar()
	if (this instanceof Compartimento) {
		var botao = document.getElementsByClassName("criar")[0];
		botao.style.display = "inline-block";
		botao = document.getElementsByClassName("apagar")[0];
		botao.style.display = "inline-block";
		botao = document.getElementsByClassName("monitorizar")[0];
		botao.style.display = "inline-block";
		botao = document.getElementsByClassName("voltar")[0];
		botao.style.display = "inline-block";
	}
};

/**
 * Metodo para navegar entre paginas, mostrando o conteudo do objecto selecionado da lista
 * @param {number} id - numero passado referente ao index onde o objecto se encontra
 */
Ecra.prototype.navegar = function(id) {
	this.listaElementos[id].apresentar(document.getElementById("sistema"));
};

/**
 * Metodo generico para criar botoes
 * @param {string} texto - textContent para o anchor tag
 * @param {functiono} clickHandler - funcao passada para o evento
 * @param {string} classe - classe passada para ser atribuido ao elemento HTML
 */
Ecra.prototype.criarBotao = function (texto, clickHandler, classe) {
	var botao = new Visualizavel("a");
	botao.visualizacao.textContent = texto;
	botao.visualizacao.setAttribute("href", "#");
	botao.visualizacao.className = "btn";
	if (classe) {
		botao.visualizacao.className += ' ' + classe;
	}
	botao.addOnType("click", clickHandler.bind(this));
	this.listaBotoes.push(botao.visualizacao);
};

/**
 * Metodo generico para criar um ecra.
 * Verifica-se o tipo de objecto do this e dependente disso, mostra-se uma certa mensagem no prompt
 * e cria-se o tipo de objecto correspondente.
 */
Ecra.prototype.criarEcra = function () {
    // usar a lista de elementos para verificar a os elementos que ja existem? ver se da para usar o this
    // tentar meter a verificacao do prompt numa funcao a parte
	var promptRecebido;
	if (this instanceof SistemaDomotico) {
		promptRecebido = prompt("Indique o nome da Consola:");
		if (promptRecebido && this.validarNome.call(this, promptRecebido)) {
			this.listaElementos.push(new Consola(promptRecebido, this.objectoPai));
			this.apresentar(this.visualizacao);
		} else if (promptRecebido === null) {
			return;
		} else {
            alert("Já existe uma consola com esse nome!");
        }
	} else if (this instanceof Consola) {
		promptRecebido = prompt("Indique o nome do Compartimento:");
		if (promptRecebido && this.validarNome.call(this, promptRecebido)) {
			this.listaElementos.push(new Compartimento(promptRecebido, this));
			this.apresentar(this.visualizacao);
		} else {
			alert("Já existe um compartimento com esse nome!");
		}
	} else {
		promptRecebido = prompt("Indique o tipo de equipamento que pretende criar", "1-Termometro, 2-DetetorMovimento, 3-DetetorFecho (Porta), 4-EstoreEletrico, 5-ArCondicionado, 6-GeradorMovimento, 7-TrincoEletrico, 8-MotorEletrico");
        var maiorTemperatura;
		for (var i = 0, quantos = this.listaElementos.length; i < quantos; i++) {
			if (this.listaElementos[i] instanceof Termometro) {
				maiorTemperatura = this.listaElementos[i].temperatura;
			}
		}
		switch (promptRecebido) {
			case "1":
				this.listaElementos.push(new Termometro(this, maiorTemperatura));
				break;
            case "2":
				this.listaElementos.push(new DetetorMovimento(this));
				break;
            case "3":
                this.listaElementos.push(new Porta(this));
                break;
            case "4":
                this.listaElementos.push(new EstoreEletrico(this));
                break;
			case "5":
				this.listaElementos.push(new ArCondicionado(this));
				break;
            case "6":
				this.listaElementos.push(new GeradorMovimento(this));
				break;
            case "7":
                this.listaElementos.push(new Trinco(this));
                break;
            case "8":
                this.listaElementos.push(new MotorEletrico(this));
                break;
        }
        this.apresentar(this.visualizacao);
	}
};

/**
 * Método para validar se a lista de elementos de um dado objeto contem algum elemento com o mesmo nome que o nome recebido.
 *
 * @param {string} nome - string que será comparada com os elementos da lista
 * @param {Object[]} listaElementos - lista com os elementos a comparar o nome
 * @returns {boolean}
 */
Ecra.prototype.validarNome = function(nome, listaElementos) {
    listaElementos = listaElementos || this.listaElementos;
    var aux = nome.toUpperCase().replace(/\s/g, '');
    for(var i = 0, quantos = listaElementos.length; i < quantos; i++) {
        var tituloAux = listaElementos[i].titulo.toUpperCase().replace(/\s/g, '');
        if (aux === tituloAux) {
            return false;
        }
    }
    return true;
}

/**
 * Metodo generico para apagar um ecra
 */
Ecra.prototype.apagarEcra = function() {
	var inputsChecked = document.getElementsByTagName("input");
	var aux = [];
	for (var i = 0; i < inputsChecked.length; i++) {
		if (inputsChecked[i].checked) {
			aux.push(i);
		}
	}
	for (var z = aux.length; z > 0; z--) {
		var dataId = inputsChecked[aux[z-1]].getAttribute("data-id");
		this.listaElementos.splice(dataId, 1);
	}
	this.apresentar(this.visualizacao);
};

/**
 * Método que representa a acção de voltar, ou seja, é apresentado o objeto pai do próprio(this).
 */
Ecra.prototype.voltarEcra = function () {
	this.objectoPai.apresentar(document.getElementById("sistema"));
};

/**
 * Método que é chamada quando existe o evento onClick do titulo, o utilizador insere um novo nome,
 * e após a verificação se já existe é feita a alteração.
 *
 * @param {HTMLElement} inputTitulo - valor que o utilizador inseriu no input, elemento HTML.
 */
Ecra.prototype.mudarInput = function(inputTitulo) {
    var aux = inputTitulo.visualizacao.value;
    if(this.validarNome.call(this, aux, this.objectoPai.listaElementos)) {
        this.titulo = aux;
        inputTitulo.visualizacao.style.display = "none";
        this.apresentar(document.getElementById("sistema"));
        if(this instanceof Compartimento) {
            this.monitorizar();
        }
    }else {
        alert("Nome já existente");
    }
};

/**
 * Classe SistemaDomotico
 */

/**
 * @class Objeto que simula todo o sistema domotico, que será constituido por consolas
 * @constructs SistemaDomotico
 * @extends Ecra
 *
 */
function SistemaDomotico() {
	Ecra.call(this, "Sistema Domotico", "Consolas:", this);

	this.criarBotao("Criar", this.criarEcra.bind(this));
	this.criarBotao("Apagar", this.apagarEcra);
}
SistemaDomotico.prototype = Object.create(Ecra.prototype);
SistemaDomotico.prototype.constructor = SistemaDomotico;

/**
 * Método que irá criar as consolas, compartimentos e equipamentos por omissão dentro do sistema domótico
 */
SistemaDomotico.omissao = function() {
    var sis = new SistemaDomotico();
    var cs1 = new Consola("Piso Basofe", sis);
    sis.listaElementos.push(cs1);

    var c1 = new Compartimento("Sala dos Tropas", cs1);
    var c2 = new Compartimento("Sala do Jaiminho", cs1);
    cs1.listaElementos.push(c1);
    cs1.listaElementos.push(c2);

    var e1 = new Trinco(c1);
    var e2 = new Porta(c1);
    var e3 = new Trinco(c1);
    var e4 = new Porta(c1);
    var e5 = new ArCondicionado(c1);
    var e6 = new ArCondicionado(c1);
    var e7 = new Termometro(c1);
    var e8 = new Termometro(c1);
    var e9 = new GeradorMovimento(c1);
    var e10 = new GeradorMovimento(c1);
    var e11 = new DetetorMovimento(c1);
    var e12 = new DetetorMovimento(c1);
    var e13 = new MotorEletrico(c1);
    var e14 = new EstoreEletrico(c1);
    var e15 = new MotorEletrico(c1);
    var e16 = new EstoreEletrico(c1);

    c1.listaElementos.push(e1);
    c1.listaElementos.push(e2);
    c1.listaElementos.push(e3);
    c1.listaElementos.push(e4);
    c1.listaElementos.push(e5);
    c1.listaElementos.push(e6);
    c1.listaElementos.push(e7);
    c1.listaElementos.push(e8);
    c1.listaElementos.push(e9);
    c1.listaElementos.push(e10);
    c1.listaElementos.push(e11);
    c1.listaElementos.push(e12);
    c1.listaElementos.push(e13);
    c1.listaElementos.push(e14);
    c1.listaElementos.push(e15);
    c1.listaElementos.push(e16);
    return sis;
};

/**
 * Classe Consola
 */

/**
 * @class Objetos que simulam as consolas incluidas no sistema domotico
 * @constructs Consola
 * @extends Ecra
 * @param {string} identificacao - nome de cada consola criada.
 * @param {Object} objectoPai - referencia do objecto pai do mesmo.
 */
function Consola(identificacao, objectoPai) {
	Ecra.call(this, identificacao, "Compartimentos:", objectoPai);
	this.criarBotao("Criar", this.criarEcra.bind(this));
	this.criarBotao("Apagar", this.apagarEcra);
	this.criarBotao("Voltar", this.voltarEcra);
}
Consola.prototype = Object.create(Ecra.prototype);
Consola.prototype.constructor = Consola;

/**
 * Classe Compartimento
 */

/**
 * @class Objetos que simulam os compartimentos incluidos em cada consola
 * @constructs Compartimento
 * @extends Ecra
 * @param {string} identificacao - nome de cada compartimento criado.
 * @param {Object} objectoPai - referencia do objecto pai do mesmo.
 */
function Compartimento(identificacao, objectoPai) {
	Ecra.call(this, identificacao, "Equipamentos", objectoPai);
	this.criarBotao("Criar", this.criarEcra.bind(this), "criar");
	this.criarBotao("Apagar", this.apagarEcra, "apagar");
	this.criarBotao("Monitorizar", this.monitorizar.bind(this), "monitorizar");
	this.criarBotao("Voltar", this.voltarEcra, "voltar");
	this.criarBotao("Listar", this.listar, "listar");
}
Compartimento.prototype = Object.create(Ecra.prototype);
Compartimento.prototype.constructor = Compartimento;

/**
 * Método que irá apresentar a tabela com todos os equipamentos existentes dentro do compartimento.
 */
Compartimento.prototype.monitorizar = function() {
	var nrLinhas = Math.ceil(Math.sqrt(this.listaElementos.length));
	this.painel = new Painel(nrLinhas, nrLinhas);

	var index = 0;
	for (var i = 0; i < nrLinhas; i++) {
		for (var j = 0; j < nrLinhas; j++) {
			if(index <= this.listaElementos.length) {
				this.painel.colocar(i, j, this.listaElementos[index]);
			}
			index++;
		}
	}

	var botao = document.getElementsByClassName("criar")[0];
	botao.style.display = "none";
	botao = document.getElementsByClassName("apagar")[0];
	botao.style.display = "none";
	botao = document.getElementsByClassName("monitorizar")[0];
	botao.style.display = "none";
	botao = document.getElementsByClassName("voltar")[0];
	botao.style.display = "none";

	var listaElementos = document.getElementById('elementos');
	listaElementos.style.display = "none";

	botao = document.getElementsByClassName("listar")[0];
	botao.style.display = "inline-block";
	this.visualizacao.insertBefore(this.painel.visualizacao, botao);
};

/**
 * Método que funciona como um voltar atrás, passa na representação dos equipamentos de um compartimento em tabela, para uma listagem apenas com as siglas dos equipamentos.
 */
Compartimento.prototype.listar = function() {
	var tabela = document.getElementsByTagName("table")[0];
	if (typeof tabela != 'undefined') {
		tabela.parentNode.removeChild(tabela);
	}

	var elementos = document.getElementById("elementos");
	elementos.style.display = "block";

	var botao = document.getElementsByClassName("criar")[0];
	botao.style.display = "inline-block";
	botao = document.getElementsByClassName("apagar")[0];
	botao.style.display = "inline-block";
	botao = document.getElementsByClassName("monitorizar")[0];
	botao.style.display = "inline-block";
	botao = document.getElementsByClassName("voltar")[0];
	botao.style.display = "inline-block";
	botao = document.getElementsByClassName("listar")[0];
	botao.style.display = "none";
};

/**
 * Classe Tabela
 */

/**
 * @class Uma tabela que será apresentada na página.
 * @constructs Tabela
 * @extends Visualizavel
 * @param {number} linhas - número de linhas da tabela.
 * @param {number} colunas - número de colunas da tabela.
 * @throws {Error} Se o número de linhas e de colunas não for positivo
 */
function Tabela(linhas, colunas) {
	Visualizavel.call(this, "table");
	if ((linhas > 0) && (colunas > 0)) {
		var tbody = document.createElement("tbody");
		var tr, td;
		for (var i = 0; i < linhas; i++) {
			tr = document.createElement("tr");
			for (var j = 0; j < colunas; j++) {
				td = document.createElement("td");
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		this.visualizacao.appendChild(tbody);
	} else {
		throw new Error("Dimensões impossíveis na tabela!");
	}
}
Tabela.prototype = Object.create(Visualizavel.prototype);
Tabela.prototype.constructor = Tabela;

/**
 * Devolve a célula HTML na posição (linha,coluna) da tabela
 * @param {number} linha - linha da célula.
 * @param {number} coluna - coluna da célula.
 * @returns {HTMLElement} célula HTML na posição (linha,coluna).
 */
Tabela.prototype.celula = function (linha, coluna) {
	var linhas = this.visualizacao.rows;
	if ((linha >= 0) && (linha < linhas.length)) {
		var colunas = linhas[linha];
		if ((coluna >= 0) && (coluna < colunas.cells.length)) {
			return colunas.cells[coluna];
		}
	}
};

/**
 * Classe Painel
 */

/**
 * @class Objetos que simulam um painel para colocação de equipamentos eléctricos.
 * @constructs Painel
 * @extends Tabela
 * @param {number} linhas - número de linhas do painel.
 * @param {number} colunas - número de colunas do painel.
 *
 * @property {number} linhas - número de linhas do painel.
 * @property {number} colunas - número de colunas do painel.
 * @property {Equipamento[][]} equipamentos - equipamentos no painel.
 */
function Painel(linhas, colunas) {
	Tabela.call(this, linhas, colunas);
	this.linhas = linhas;
	this.colunas = colunas;
	this.equipamentos = [];
	for (var i = 0; i < linhas; i++) {
		this.equipamentos[i] = [];
	}
}
Painel.prototype = Object.create(Tabela.prototype);
Painel.prototype.constructor = Painel;

/**
 * Coloca o equipamento na posição (linha,coluna) do painel
 * @param {number} linha - linha do painel onde colocar o equipamento.
 * @param {number} coluna - coluna do painel onde colocar o equipamento.
 * @param {Equipamento} equipamento - equipamento a colocar no painel (se "undefined" retira o equipamento lá existente).
 * @returns {Painel} O próprio objeto Painel: permite a realização de "Method Chaining".
 */
Painel.prototype.colocar = function (linha, coluna, equipamento) {
	if ((linha >= 0)
		&& (linha < this.linhas)
		&& (coluna >= 0) && (coluna < this.colunas)
		&& ((equipamento === void 0) || (equipamento instanceof Equipamento))) {
		this.equipamentos[linha][coluna] = equipamento;
		if (equipamento) {
			equipamento.apresentar(this.celula(linha, coluna));
		} else {
			(new Visualizavel()).apresentar(this.celula(linha, coluna));
		}
	}
	return this;
};

/**
 * Classe Equipamento
 */

/**
 * @class Objetos que simulam equipamentos.
 * @constructs Equipamento
 * @extends Imagem
 */
var Equipamento = (function () {
	return function Equipamento(sigla, objectoPai) {
		Imagem.call(this);
		this.titulo = sigla;
 		this.objetoPai = objectoPai;
	}
})();
Equipamento.prototype = Object.create(Imagem.prototype);
Equipamento.prototype.constructor = Equipamento;

/**
 * Redefinição do método apresentar para mostrar a informação relativa 
 * a todos os tipos de equipamento, de modo a mostrar apenas a informação pretendida para cada equipamento
 * verifica-se a instância do mesmo.
 * @param {HTMLElement} elemento - elemento HTML onde se vai colocar toda a informação
 */
Equipamento.prototype.apresentar = function(elemento) {
	Visualizavel.prototype.apresentar.call(this, elemento);
	
	//Elemento com a sigla do equipamento
	var siglaHtml = new Visualizavel("h5");
	if ((this instanceof Trinco || this instanceof MotorEletrico) && this.conectadoA !== void 0) {
		siglaHtml.visualizacao.textContent = this.titulo + "->" + this.conectadoA.titulo;
	} else {
		siglaHtml.visualizacao.textContent = this.titulo;
	}
	
	elemento.insertBefore(siglaHtml.visualizacao, elemento.childNodes[0]);
	
	//Caso seja um trinco, irá mostrar a lista de portas
	if (this instanceof Trinco) {
		var selectTrinco = new Visualizavel("select");
		var defaultOption = document.createElement("option");
		defaultOption.textContent = "Seleciona";
		defaultOption.setAttribute("disabled", "disabled");
		defaultOption.setAttribute("selected", "selected");
		selectTrinco.visualizacao.appendChild(defaultOption);
		selectTrinco.addOnType("change", this.conecta.bind(this, selectTrinco));
		siglaHtml.addOnType("click", function() {
			siglaHtml.visualizacao.style.display = "none";
			selectTrinco.visualizacao.style.display = "block";
		});

		for (var i = 0; i < this.objetoPai.listaElementos.length; i++) {
			if (this.objetoPai.listaElementos[i] instanceof Porta) {
				var opt = document.createElement('option');
                opt.value = i;
				opt.textContent = this.titulo + "->" + this.objetoPai.listaElementos[i].titulo;
				selectTrinco.visualizacao.appendChild(opt);
			}
		}

		selectTrinco.visualizacao.style.display = "none";
		elemento.insertBefore(selectTrinco.visualizacao, elemento.childNodes[1]);
	}
	//caso seja um equipamento de temperatura mostra os graus
	else if(this instanceof EquipamentoTemperatura) {
		var temperaturaHtml = new Visualizavel("h4");
		temperaturaHtml.visualizacao.textContent = this.temperatura + " ºC";
		elemento.insertBefore(temperaturaHtml.visualizacao, elemento.childNodes[1]); // para inserir logo no inicio, senao fica depois da imagem do Equipamento
		
		//Se for ar condicionado apresentar uma caixa de texto para alterar a temperatura, e possibilita a activação do AC ao clicar
		if (this instanceof ArCondicionado) {
			var inputTemperatura = new Input();
			inputTemperatura.addValue(this.temperatura);
			inputTemperatura.addOnType("change", this.mudarTemperatura.bind(this, inputTemperatura));
			temperaturaHtml.addOnType("click", function() {
				temperaturaHtml.visualizacao.style.display = "none";
				inputTemperatura.visualizacao.style.display = "block";
			});
			inputTemperatura.visualizacao.style.display = "none";
			elemento.insertBefore(inputTemperatura.visualizacao, elemento.childNodes[1]);
		}
	}
	//Caso seja um motor eletrico, mostra a lista de estores a que se pode conectar,
	//A lista de estados disponíveis para o estore, e por fim aciona-se a alteração ao clicar
	else if(this instanceof MotorEletrico) {
		var estadoHtml = new Visualizavel("h4");
        if(this.conectadoA !== void 0) {
            estadoHtml.visualizacao.textContent = this.listaEstados[this.conectadoA.estado].nome;
        }else {
            estadoHtml.visualizacao.textContent = this.listaEstados[this.estado].nome;
        }

        elemento.insertBefore(estadoHtml.visualizacao, elemento.childNodes[1]);

        var botaoStart = new Visualizavel("img");
        botaoStart.visualizacao.src = "./images/start.png";
        elemento.insertBefore(botaoStart.visualizacao, elemento.childNodes[2]);

        /**
         * Manipulação dos estores
         */
        var selectEstores = new Visualizavel("select");
        var defaultOption = document.createElement("option");
		defaultOption.textContent = "Seleciona";
		defaultOption.setAttribute("disabled", "disabled");
		defaultOption.setAttribute("selected", "selected");
        selectEstores.visualizacao.appendChild(defaultOption);

        selectEstores.addOnType("change", this.conecta.bind(this, selectEstores, estadoHtml));
        siglaHtml.addOnType("click", function() {
			siglaHtml.visualizacao.style.display = "none";
			selectEstores.visualizacao.style.display = "block";
		});

        //Inserção de todos os estores eletricos possíveis de manipular no motor eletrico
        for (var i = 0; i < this.objetoPai.listaElementos.length; i++) {
            if (this.objetoPai.listaElementos[i] instanceof EstoreEletrico) {
                var opt = document.createElement('option');
                opt.value = i;
                opt.textContent = this.titulo + "->" + this.objetoPai.listaElementos[i].titulo;
                selectEstores.visualizacao.appendChild(opt);
            }
        }

		selectEstores.visualizacao.style.display = "none";
		elemento.insertBefore(selectEstores.visualizacao, elemento.childNodes[0]);

        /**
         * Manipulação do estado de um dos estores eletricos
         */
        var selectEstados = new Visualizavel("select");

        estadoHtml.addOnType("click", function() {
			estadoHtml.visualizacao.style.display = "none";
			selectEstados.visualizacao.style.display = "block";
		});

        //Inserção de todos os estores eletricos possíveis de manipular no motor eletrico
        for (var j = 0; j < this.listaEstados.length; j++) {
                var opt = document.createElement('option');
                opt.value = j;
                opt.textContent = this.listaEstados[j].nome;
                selectEstados.visualizacao.appendChild(opt);
        }


        botaoStart.addOnType("click", this.alternarEstado.bind(this, selectEstados, estadoHtml));
        selectEstados.visualizacao.style.display = "none";
        elemento.insertBefore(selectEstados.visualizacao, elemento.childNodes[2]);
	}

}
/**
 * Classe EquipamentoOnOff
 */

/**
 * @class Objetos que simulam equipamentos com dois estados (On/Off - Ligados/Desligados).
 * @constructs EquipamentoOnOff
 * @extends Equipamento
 * 
 * @param {string} sigla - nome do Equipamento
 * @param {string} imagemOn - nome do ficheiro de imagem que representa o equipamento ligado.
 * @param {string} imagemOff - nome do ficheiro de imagem que representa o equipamento desligado.
 * @param {Object} objetoPai - Objeto que o contem. Neste caso um compartimento.
 * @property {boolean} ligado - indica se o equipamento está ligado ou desligado.
 */
function EquipamentoOnOff(sigla, imagemOn, imagemOff, objetoPai) {
	Equipamento.call(this, sigla, objetoPai);
	var ligado = this.onAtualizarEstado(false, imagemOn, imagemOff);
	Object.defineProperty(this, "ligado", {
		enumerable: true,
		configurable: false,
		get: function () {
			return ligado;
		},
		set: function (estado) {
			ligado = this.onAtualizarEstado(estado, imagemOn, imagemOff);
		}
	});
}
EquipamentoOnOff.prototype = Object.create(Equipamento.prototype);
EquipamentoOnOff.prototype.constructor = EquipamentoOnOff;

/**
 * Conecta um EquipamentoOnOff a outro.
 * @param {HTMLElement} selectTrinco - elemento HTML 'select' onde vamos buscar o value que é o index do array onde o equipamento se encontra.
 */
EquipamentoOnOff.prototype.conecta = function(selectTrinco) {
	var aux = selectTrinco.visualizacao.options[selectTrinco.visualizacao.selectedIndex].value;
	this.conectadoA = this.objetoPai.listaElementos[aux];
	selectTrinco.visualizacao.style.display = "none";
	this.objetoPai.apresentar(document.getElementById("sistema"));
	this.objetoPai.monitorizar();
};

/**
 * Evento que é ativado quando se tenta alterar o estado (ligado/desligado) do EquipamentoOnOff. Para manter o valor original basta devolver o "this.ligado".
 * @protected
 * @param {boolean} estado - estado (ligado/desligado) em que se pretende que fique o EquipamentoOnOff.
 * @param {string} imagemOn - nome do ficheiro de imagem que representa o equipamento ligado.
 * @param {string} imagemOff - nome do ficheiro de imagem que representa o equipamento desligado.
 * @returns {boolean} Estado (ligado/desligado) em que ficará o EquipamentoOnOff.
 */
EquipamentoOnOff.prototype.onAtualizarEstado = function (estado, imagemOn, imagemOff) {
	this.ficheiro = (estado ? imagemOn : imagemOff);
	return estado;
};

/**
 * Classe GeradorMovimento
 */

/**
 * @class Objectos que simulam geradores de movimentos
 * @constructs GeradorMovimento
 * @extends EquipamentoOnOff
 *
 * @param {Object} objetoPai - referência do objeto pai.
 */
var GeradorMovimento = (function () {
	var counter = 1;
	return function GeradorMovimento(objetoPai) {
    	EquipamentoOnOff.call(this, "GM" + counter++, "./images/comMovimento.png", "./images/semMovimento.png", objetoPai);
    	this.addOnType("click", this.alternar.bind(this));
	}
})();
GeradorMovimento.prototype = Object.create(EquipamentoOnOff.prototype);
GeradorMovimento.prototype.constructor = GeradorMovimento;

/**
 * Método para alternar o estado de um detetor de movimento ao ativar/desativar o gerador de movimento.
 */
GeradorMovimento.prototype.alternar = function() {
	this.ligado = !this.ligado; //muda o estado do gerador de movimento, e irá mudar a imagem

    var detetoresOff = true;
	var geradoresLigados = 0;
	var nrGeradores = 0;

	for(var i = 0; i < this.objetoPai.listaElementos.length; i++) {
		if(this.objetoPai.listaElementos[i] instanceof DetetorMovimento) { //se o elemento da lista for um detetor
			if(this.objetoPai.listaElementos[i].ligado) { //e se esse detetor tiver ligado
				detetoresOff = false;
			}
		}
		else if(this.objetoPai.listaElementos[i] instanceof GeradorMovimento) { //se o elemento da lista for um gerador
			if(this.objetoPai.listaElementos[i].ligado) { //e se estiver ligado
				geradoresLigados++;
			}
			nrGeradores++;
		}
	}

	if(detetoresOff) { //caso não haja detetores ligados, irá liga-los
		for (var j = 0; j < this.objetoPai.listaElementos.length; j++) {
			if(this.objetoPai.listaElementos[j] instanceof DetetorMovimento) {
				this.objetoPai.listaElementos[j].ligado = !this.objetoPai.listaElementos[j].ligado;
			}
		}
	}
	else if(!detetoresOff && nrGeradores == 1) { //se estiverem ligados e houver apenas 1 gerador
		for (var j = 0; j < this.objetoPai.listaElementos.length; j++) {
			if(this.objetoPai.listaElementos[j] instanceof DetetorMovimento) {
				this.objetoPai.listaElementos[j].ligado = !this.objetoPai.listaElementos[j].ligado;
			}
		}
	}
	else if(!detetoresOff && geradoresLigados == 0 && nrGeradores > 1) {
		for (var j = 0; j < this.objetoPai.listaElementos.length; j++) {
			if(this.objetoPai.listaElementos[j] instanceof DetetorMovimento) {
				this.objetoPai.listaElementos[j].ligado = !this.objetoPai.listaElementos[j].ligado;
			}
		}
	}
};

/**
 * Classe DetetorMovimento
 */

/**
 * @class Objectos que simulam detetores de movimentos
 * @constructs DetetorMovimento
 * @extends EquipamentoOnOff
 *
 * @param {Object} objetoPai - referência do objeto pai.
 */
var DetetorMovimento = (function() {
	var counter = 1;
	return function DetetorMovimento(objetoPai) {
		EquipamentoOnOff.call(this, "DM" + counter++, "./images/MovimentoOn.png", "./images/MovimentoOff.png", objetoPai);
		var aux = 0;
		this.objetoPai.listaElementos.forEach(function(current, index, array) {
			if (current instanceof DetetorMovimento && current.ligado == true) {
				aux++;
			}
		});
		if (aux > 0) {
			this.ligado = true;
		}
	}
})();
DetetorMovimento.prototype = Object.create(EquipamentoOnOff.prototype);
DetetorMovimento.prototype.constructor = DetetorMovimento;

/**
 * Classe Porta
 */

/**
 * @class Objectos que simulam detetores de movimentos
 * @constructs Porta
 * @extends EquipamentoOnOff
 *
 * @param {Object} objetoPai - referência do objeto pai da porta, neste caso será o compartimento onde está inserido a porta.
 */
var Porta = (function() {
	var counter = 1;
	return function Porta(objetoPai) {
		EquipamentoOnOff.call(this, "DF" + counter++, "./images/portaAberta.png", "./images/portaFechada.png", objetoPai);
		this.ligado = true;
	} 
})();
Porta.prototype = Object.create(EquipamentoOnOff.prototype);
Porta.prototype.constructor = Porta;

/**
 * Classe Trinco
 */

/**
 * @class Objectos que simulam trincos
 * @constructs Trinco
 * @extends EquipamentoOnOff
 *
 * @param {Object} objetoPai - referência do objeto pai do trinco, neste caso será o compartimento onde está inserido o trinco.
 */
var Trinco = (function () {
	var counter = 1;
	return function Trinco(objetoPai) {
		EquipamentoOnOff.call(this, "TE" + counter++, "./images/fechoAberto.png", "./images/fechoFechado.png", objetoPai);
		this.addOnType("click", this.alternar.bind(this));
		this.conectadoA = void 0;
		this.ligado = true;
	}
})();
Trinco.prototype = Object.create(EquipamentoOnOff.prototype);
Trinco.prototype.constructor = Trinco;

/**
 * Função que verifica se o Trinco está conectado a algum EquipamentoOnOff a atualiza o seu estado e atualiza o seu próprio estado para o estado recebido como parametro.
 * @param {boolean} estado - estado (ligado/desligado) em que se pretende que fique o EquipamentoOnOff.
 * @param {string} imagemOn - nome do ficheiro de imagem que representa o equipamento ligado.
 * @param {string} imagemOff - nome do ficheiro de imagem que representa o equipamento desligado.
 * @returns {boolean} Estado (ligado/desligado) em que ficará o Trinco.
 */
Trinco.prototype.onAtualizarEstado = function (estado, imagemOn, imagemOff) {
	if (this.conectadoA instanceof EquipamentoOnOff) {
		this.conectadoA.ligado = estado;
	}
	return EquipamentoOnOff.prototype.onAtualizarEstado.call(this, estado, imagemOn, imagemOff);
};

/**
 * Alterna o estado (ligado / desligado) do trinco
 */
Trinco.prototype.alternar = function () {
	this.ligado = !this.ligado;
};

/**
 * Classe EquipamentoTemperatura
 */

/**
 * @class Objectos que representam equipamentos de temperatura
 * @constructs EquipamentoTemperatura
 * @extends Equipamento
 *
 * @param {string} sigla - sigla que representa este equipamento
 * @param {string} imagemEquipamento - nome do ficheiro da imagem que representa o equipamento de temperatura
 * @param {Object} objetoPai - referencia para o objecto pai do proprio
 *
 */
function EquipamentoTemperatura(sigla, imagemEquipamento, objetoPai) {
	Equipamento.call(this, sigla, objetoPai);
	this.ficheiro = imagemEquipamento;
	this.temperatura = 25;
}
EquipamentoTemperatura.prototype = Object.create(Equipamento.prototype);
EquipamentoTemperatura.prototype.constructor = EquipamentoTemperatura;

/**
 * Este método trata-se do clickhandler da imagem do ar condicionado, ou seja, quando se clica no ar condicionado,
 * o mesmo é activado e altera com a sua temperatura a temperatura de todos os termometros no compartimento.
 */
EquipamentoTemperatura.prototype.ativarAC = function() {

	for(var i = 0; i < this.objetoPai.listaElementos.length; i++) {
		if (this.objetoPai.listaElementos[i] instanceof Termometro) {
			this.objetoPai.listaElementos[i].temperatura = this.temperatura;
		}
	}
	this.objetoPai.apresentar(document.getElementById("sistema"));
	this.objetoPai.monitorizar();

};

/**
 * Evento que é ativado quando se tenta alterar a temperatura de um Ar Condicionado (tentará atualizar a temperatura dos Termometros do compartimento, caso nao haja nenhum Ar Condicionado com maior temperatura)
 * @param {HTMLElement} inputTemperatura - Objecto do tipo Visualizavel, que é um elemento HTML (input) onde se vai buscar o valor inserido pelo utilizador
 */
EquipamentoTemperatura.prototype.mudarTemperatura = function(inputTemperatura) {
	var aux = parseInt(inputTemperatura.visualizacao.value);
    if (aux <= 50 && aux >= -50) {
        this.temperatura = aux;
        inputTemperatura.visualizacao.style.display = "none";

        this.objetoPai.apresentar(document.getElementById("sistema"));
        this.objetoPai.monitorizar();
    }
    else {
        alert("A temperatura tem de estar entre -50º e 50º.");
    }
};

/**
 * Classe Termometro
 */

/**
 * @class Objectos que representam um termometro
 * @constructs Termometro
 * @extends EquipamentoTemperatura
 *
 * @param {Object} objetoPai - referencia para o objecto pai do proprio
 * @param {number} temperatura - valor inicial do termometro
 *
 */
var Termometro = (function() {
	var counter = 1;
	return function Termometro(objetoPai, temperatura) {
		EquipamentoTemperatura.call(this, "TM" + counter++, './images/termometro.png', objetoPai);
		this.temperatura = temperatura || 25;
	}
})();
Termometro.prototype = Object.create(EquipamentoTemperatura.prototype);
Termometro.prototype.constructor = Termometro;

/**
 * Classe ArCondicionado
 */

/**
 * @class Objectos que representam um ar condicionado
 * @constructs ArCondicionado
 * @extends EquipamentoTemperatura
 *
 * @param {Object} objetoPai - referencia para o objecto pai do proprio
 *
 */
var ArCondicionado = (function() {
	var counter = 1;
	return function ArCondicionado(objetoPai) {
		EquipamentoTemperatura.call(this, "AC" + counter++, './images/arCondicionado.png', objetoPai);
		this.conectadoA = void 0;
		//adiciona o onClick à imagem
		this.addOnType("click", this.ativarAC.bind(this));
	}
})();
ArCondicionado.prototype = Object.create(EquipamentoTemperatura.prototype);
ArCondicionado.prototype.constructor = ArCondicionado;

/**
 * Classe EquipamentoPosicao
 */

/**
 * @class Objetos que simulam equipamentos de posição com cinco estados.
 * @constructs EquipamentoPosicao
 * @extends Equipamento
 * 
 * @param {string} sigla - nome do Equipamento
 * @param {Object} objetoPai - referência do objeto acima, neste caso o objeto pai será o compartimento onde o equipamento está inserido.
 */
function EquipamentoPosicao(sigla, objetoPai) {
    Equipamento.call(this, sigla, objetoPai);

    this.listaEstados = [
		{"nome": "Aberto", "imagem": "./images/aberto.png"},
		{"nome": "Dois Terços", "imagem": "./images/doisTercos.png"},
		{"nome": "Meio Aberto", "imagem": "./images/meioAberto.png"},
		{"nome": "Um Terço", "imagem": "./images/umTerco.png"},
		{"nome": "Fechado", "imagem": "./images/fechado.png"}
	];

    var estado = this.onAtualizarEstado(0, this.listaEstados);
	Object.defineProperty(this, "estado", {
		enumerable: true,
		configurable: false,
		get: function () {
			return estado;
		},
		set: function (newEstado) {
			estado = this.onAtualizarEstado(newEstado, this.listaEstados);
		}
	});
}
EquipamentoPosicao.prototype = Object.create(Equipamento.prototype);
EquipamentoPosicao.prototype.constructor = EquipamentoPosicao;

/**
 * Atualiza o seu estado, alterando a imagem respectiva.
 * @param {number} estado - Index do array, que corresponde a um certo estado.
 * @param {string[]} listaEstados - onde se vai buscar a imagem correspondente ao estado.
 * @returns {number} Posição no array de estados
 */
EquipamentoPosicao.prototype.onAtualizarEstado = function(estado, listaEstados) {
    for (var i = 0; i < listaEstados.length; i++) {
        if (i == estado) {
            if(this instanceof EstoreEletrico) {
                this.ficheiro = listaEstados[i].imagem;
            }
            estado = i;
        }
    }
    return estado;
};

/**
 * Evento que é ativado quando se clica no botão 'start' que vai alterar o estado do equipamento conectado a ele.
 * @param {HTMLElement} selectEstados - elemento HTML 'select' onde se vai buscar o estado selecionado.
 * @param {HTMLElement} htmlEstado - elemento HTML onde mostra em texto o estado do equipamento.
 */
EquipamentoPosicao.prototype.alternarEstado = function(selectEstados, htmlEstado) {
	this.conectadoA.estado = selectEstados.visualizacao.options[selectEstados.visualizacao.selectedIndex].value;
    this.estado = this.conectadoA.estado;
    htmlEstado.visualizacao.textContent = this.listaEstados[this.estado].nome;
    selectEstados.visualizacao.style.display = "none";
    htmlEstado.visualizacao.style.display = "block"
};

/**
 * Classe MotorEletrico
 */

/**
 * @class Objetos que simulam os motores que alteram o estado dos estores.
 * @constructs MotorEletrico
 * @extends EquipamentoPosicao
 * 
 * @param {Object} objetoPai - referência do objeto acima, neste caso o objeto pai é o compartimento onde o motor eletrico esta inserido..
 */
var MotorEletrico = (function() {
	var counter = 1;
	return function MotorEletrico(objetoPai) {
		EquipamentoPosicao.call(this, "ME" + counter++, objetoPai);
		this.conectadoA = void 0;
	}
})();
MotorEletrico.prototype = Object.create(EquipamentoPosicao.prototype);
MotorEletrico.prototype.constructor = MotorEletrico;

/**
 * Conecta o Motor Electrico a outro EquipamentoPosicao, neste caso um Estore Eletrico.
 * @param {HTMLElement} selectEstores - elemento HTML 'select' onde se vai buscar os Estores existentes no compartimento.
 * @param {HTMLElement} htmlEstado - elemento HTML onde mostra em texto o estado do equipamento.
 */
MotorEletrico.prototype.conecta = function(selectEstores, htmlEstado) {
    var aux = selectEstores.visualizacao.options[selectEstores.visualizacao.selectedIndex].value;
    this.conectadoA = this.objetoPai.listaElementos[aux];
    this.estado = this.conectadoA.estado;
    htmlEstado.visualizacao.textContent = this.listaEstados[this.estado].nome;
	selectEstores.visualizacao.style.display = "none";
	this.objetoPai.apresentar(document.getElementById("sistema"));
    this.objetoPai.monitorizar();
};

/**
 * Classe EstoreEletrico
 */

/**
 * @class Objetos que simulam os estores eletricos.
 * @constructs EstoreEletrico
 * @extends EquipamentoPosicao
 * 
 * @param {Object} objetoPai - referência do objeto acima, neste caso o objeto pai é o compartimento onde o motor eletrico esta inserido..
 */
var EstoreEletrico = (function() {
	var counter = 1;
	return function EstoreEletrico(objetoPai) {
		EquipamentoPosicao.call(this, "EE" + counter++, objetoPai);
	}
})();

EstoreEletrico.prototype = Object.create(EquipamentoPosicao.prototype);
EstoreEletrico.prototype.constructor = EstoreEletrico;

/**
 * @memberof window
 * @property {function} onload - função que será executada quando a página estiver toda carregada.
 */
window.onload = function () {
	(SistemaDomotico.omissao()).apresentar(document.getElementById("sistema"));
};
