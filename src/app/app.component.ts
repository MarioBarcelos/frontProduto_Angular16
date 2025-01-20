import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ProdutoService } from './service/produto.service';
import { Produto } from './module/produto';
import { error } from 'console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ReactiveFormsModule, 
    NavBarComponent, 
    HttpClientModule,
    CommonModule
  ], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers: [ProdutoService]
})
export class AppComponent {
  produtoForm: any;

  produtos: Produto[] = [];

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private http: HttpClient
  ) {
    this.produtoForm = this.fb.group({
      id: [],
      nome: [null, Validators.required],
      valor: [null, Validators.required],
      descricao: []
    });

    this.buscarProdutos();
  }

  criarProduto(): Produto {
    return {
      id: this.produtoForm.get('id')?.value,
      nome: this.produtoForm.get('nome')?.value,
      valor: this.produtoForm.get('valor')?.value,
      descricao: this.produtoForm.get('descricao')?.value
    };
  }

  salvarProduto() {
    if (this.produtoForm.valid) {
      const produto = this.criarProduto();
      console.log('produto', produto);
    
      this.produtoService.salvar(produto).subscribe(
        {
          next: (res) => {
            this.produtoForm.reset();
            this.buscarProdutos();
            alert("Produto Salvo com Sucesso!");
          },
          error: (error) => {
            console.log(error);
          }
        }
      )
    }
  }

  buscarProdutos() {
    this.produtoService.buscarTodos().subscribe(
      {
        next: (res) => {
          this.produtos = res;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }

  removerProduto(produto: Produto) {
    const confirmacao = confirm(`Você confirma a remoção do Produto ${produto.nome}?`);
    if (confirmacao) {
      const id = produto.id;
      this.produtoService.deletar(id).subscribe(
        {
          next: (res) => {
            this.buscarProdutos();
            alert("Produto removido com Sucesso!");
          },
          error: (error) => {
            console.log(error);
          }
        }
      )
    }
  }
}
