import { FieldVisitTemp } from './../../models/field-visit.model';
import { FieldVisitService } from './../../services/field-visit.service';
import { User } from '../../models/user.model';
import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { FieldVisit } from '../../models/field-visit.model';
import { Router } from '@angular/router';
import { FieldService } from './../../services/field.service';
import { Field } from 'app/models/field.model';

@Component({
  selector: 'app-field-visits',
  templateUrl: './field-visits.component.html',
  styleUrls: ['./field-visits.component.css']
})
export class FieldVisitsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['registrationNo', 'address', 'farmerName', 'date', 'division', 'requestNote', 'status', 'view', 'delete'];
  dataSource: MatTableDataSource<FieldVisitTemp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  page = 4;
  page1 = 5;
  focus;
  focus1;
  focus2;
  date: { year: number, month: number };
  model: NgbDateStruct;
  fieldVisits: FieldVisitTemp[];
  data: any[];
  selectedRowIndex;
  fieldVisit: FieldVisit;
  farmer: User;
  field: Field;
  farmerName: any;
  requestPending = 0;
  visitPending = 0;
  processing = 0;
  completed = 0;
  selectedType: String;

  constructor(private renderer: Renderer2, private fieldVisitService: FieldVisitService, private fieldService: FieldService, private userService: UserService, private router: Router) {
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  getRecord(row) {
    this.selectedRowIndex = row.id;
    this.fieldVisit = row;
  }
  viewFieldVisit() {
    this.router.navigate(['/field-visit-details'], { state: { fieldVisit: this.fieldVisit } });
  }
  deleteFieldVisit() {
    // this.fieldVisitService.deleteFieldVisit(this.fieldVisit.id);
  }
  selectReqType() {
    let filterValue;
    if (this.selectedType == "all") {
      filterValue = '';
    } else {
      filterValue = this.selectedType;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  async ngOnInit() {
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

    this.fieldVisitService.getFieldVisits().subscribe(data => {
      this.fieldVisits = data.map(e => {
        console.log(this.fieldVisit)
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as FieldVisit
        } as FieldVisitTemp;
      })

      this.fieldVisits.forEach(f => {
        if (f.status == 'request pending') this.requestPending += 1;
        else if (f.status == 'visit pending') this.visitPending += 1;
        else if (f.status == 'processing') this.processing += 1;
        else if (f.status == 'completed') this.completed += 1;

        this.fieldService.getField(f.fieldId).subscribe(data => {
          this.field = data.payload.data() as Field;
          f.field = this.field;
          f.address = this.field.address;
          f.registrationNo = this.field.registrationNumber;
          this.userService.getUser(this.field.farmerId).subscribe(data => {
            this.farmer = data.payload.data() as User;
            f.farmer = this.farmer;
            f.farmerName = this.farmer.firstName + " " + this.farmer.lastName;
            this.dataSource = new MatTableDataSource(this.fieldVisits);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });

          // this.dataSource = new MatTableDataSource(this.fieldVisits);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;

        });

      })

    });

  }


}

