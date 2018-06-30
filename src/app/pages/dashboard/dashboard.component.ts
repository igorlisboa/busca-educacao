import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators/takeWhile' ;
import { HttpClient } from '@angular/common/http';


interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  public cepModel : string;
  public rua : string;
  public bairro : string;
  public cidade : string;
  public uf : string;




  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  constructor(
    private themeService: NbThemeService,
    private http: HttpClient) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }


  limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    this.rua = "";
    this.bairro = "";
    this.cidade = "";
    this.uf = "";
  }

  meu_callback(conteudo) {
    if (!("erro" == conteudo)) {
      //Atualiza os campos com os valores.
      this.rua = (conteudo.logradouro);
      this.bairro = (conteudo.bairro);
      this.cidade = (conteudo.localidade);
      this.uf = (conteudo.uf);
    } //end if.
    else {
      //CEP não Encontrado.
      this.limpa_formulário_cep();
      alert("CEP não encontrado.");
    }
  }

  pesquisaEndereco() {
    let valor = this.cepModel;

    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');
    if (cep.length < 8) return

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if(validacep.test(cep)) {

        //Preenche os campos com "..." enquanto consulta webservice.
        this.rua = "...";
        this.bairro = "...";
        this.cidade = "...";
        this.uf = "...";

        //Cria um elemento javascript.
        var script = document.createElement('script');

        //Sincroniza com o callback.
        let endereco = this.http.get('https://viacep.com.br/ws/'+ cep +'/json').subscribe(endereco=>{
          console.log(endereco);
          this.meu_callback(endereco)
        });
        // script.src = 'https://viacep.com.br/ws/'+ cep +'/json';


        //Insere script no documento e carrega o conteúdo.
        // document.body.appendChild(script);

      } //end if.
      else {
        //cep é inválido.
        this.limpa_formulário_cep();
        alert("Formato de CEP inválido.");
      }
    } //end if.
    else {
      //cep sem valor, limpa formulário.
      this.limpa_formulário_cep();
    }
  };

  iniciaQuestionario(){

  }
}
