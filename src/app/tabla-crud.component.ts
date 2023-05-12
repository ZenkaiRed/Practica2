import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


interface Item {
  id: number;
  code: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-tabla-crud',
  templateUrl: './tabla-crud.component.html',
  styleUrls: ['./tabla-crud.component.css']
})
export class TablaCrudComponent implements OnInit {
  items: Item[] = [];
  itemId: number = 0;
  modalAbierto = false;
  modalActualizarAbierto = false;
  itemActualizacion: any;
  item: any;
  nuevoItem: any = {
    code: '',
    name: '',
    description: ''
  };
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.http.get<Item[]>('http://20.231.202.18:8000/api/form').subscribe(
      (response) => {
        this.items = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  eliminarItem(itemId: number) {
    this.http.delete(`http://20.231.202.18:8000/api/form/${itemId}`).subscribe(() => {
      this.cargarDatos()
    });
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  enviarFormulario() {
    this.http.post('http://20.231.202.18:8000/api/form', this.nuevoItem).subscribe(
      () => {
        this.cerrarModal();
        this.cargarDatos();
      },
      (error) => {
        console.error('Error al enviar el formulario:', error);
      }
    );
  }

  abrirModalActualizar(item: any) {
    this.itemActualizacion = { ...item };
    this.modalActualizarAbierto = true;
  }

  cerrarModalActualizar() {
    this.modalActualizarAbierto = false;
  }

  actualizarItem() {
    const url = `http://20.231.202.18:8000/api/form/${this.itemActualizacion.id}`;
    const body = JSON.stringify(this.itemActualizacion);

    this.http.put(url, body, this.httpOptions).subscribe(
        () => {
          this.cerrarModalActualizar();
          this.cargarDatos();
        },
        (error) => {
          console.log(error);
        }
      );
  }

}
