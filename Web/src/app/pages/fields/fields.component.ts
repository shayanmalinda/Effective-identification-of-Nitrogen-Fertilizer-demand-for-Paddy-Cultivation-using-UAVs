import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FieldService } from '../../services/field.service';
import { Field } from '../../models/field.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css']
})

export class FieldsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['address', 'division','view','delete'];
  dataSource: MatTableDataSource<Field>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  page = 4;
  page1 = 5;
  focus;
  focus1;
  focus2;
  date: { year: number, month: number };
  model: NgbDateStruct;
  fields: Field[];
  data: any[];
  selectedRowIndex;
  field:Field;

  constructor(private renderer: Renderer2, private fieldService: FieldService,private router: Router) {
  }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getRecord(row) {
    this.selectedRowIndex = row.id;
    this.field=row;
  }
  viewField() {
    console.log(this.field);
    this.router.navigate(['/field-profile'],{ state: { field: this.field }});
  }
  deleteField() {
    this.fieldService.deleteField(this.field.id);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  ngOnInit() {
    let input_group_focus = document.getElementsByClassName('form-control');
    let input_group = document.getElementsByClassName('input-group');
    for (let i = 0; i < input_group.length; i++) {
      input_group[i].children[0].addEventListener('focus', function () {
        input_group[i].classList.add('input-group-focus');
      });
      input_group[i].children[0].addEventListener('blur', function () {
        input_group[i].classList.remove('input-group-focus');
      });
    }

    this.fieldService.getFields().subscribe(data => {
      this.fields = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as Field;
      })
      this.dataSource = new MatTableDataSource(this.fields);

    });

  }


}
