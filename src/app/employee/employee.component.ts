import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from './employee';
import {
  IMultiSelectOption,
  IMultiSelectTexts
} from 'angular-2-dropdown-multiselect';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../vendor/libs/ngx-chips/ngx-chips.scss',
    '../../vendor/libs/ngx-toastr/ngx-toastr.scss'
  ]
})
export class EmployeeComponent implements OnInit {
  private apiUrl = 'http://localhost:3001';

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'text'
    })
  };

  private modalref: any;

  enteredId: boolean;
  Id: any;

  employee: Employee;
  employees: Employee[];

  showAddress = false;

  firstName: string;
  lastName: string;
  careerLevel: string;
  dateOfBirth: string;
  dateOfJoin: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  email: string;
  skills = [];

  resultId: any;

  disabled = false;

  bar: any = 0;

  data: any;
  saved = false;

  defaultOptions: IMultiSelectOption[] = [];
  searchSettings: any;
  defaultModel: number[];

  myTexts: IMultiSelectTexts = {
    defaultTitle: 'Search Skills'
  };

  title = '';
  message = '';
  type = 'success';
  tapToDismiss = true;
  closeButton = false;
  progressBar2 = false;
  preventDuplicates = false;
  newestOnTop = false;
  progressAnimation = 'decreasing';
  positionClass = 'toast-top-right';

  items: any = [];

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private http: Http,
    private router: Router,
    private modalService: NgbModal,
    private httpclient: HttpClient,
    public toastrService: ToastrService
  ) {
    this.appService.pageTitle = 'Employee';
    this.searchSettings = {
      enableSearch: true,
      pullRight: appService.isRTL
    };
    this.getAll();
    this.clear();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.enteredId = params['id'] !== undefined ? true : false;
      this.Id = params['id'];
      this.getOptions();
      if (this.enteredId) {
        this.employees = [];
        if (!this.saved) {
          this.getEmployee();
        } else {
          this.employee.address = this.address;
          this.employee.firstName = this.firstName;
          this.employee.lastName = this.lastName;
          this.employee.careerLevel = this.careerLevel;
          this.employee.city = this.city;
          this.employee.dateOfBirth = this.dateOfBirth;
          this.employee.dateOfJoin = this.dateOfJoin;
          this.employee.empId = this.Id;
          this.employee.state = this.state;
          this.employee.skills = this.convertSkillsArray();
          this.saved = false;
          this.makeEmail();
          this.progressBar();
        }
      } else {
        this.clear();
      }
    });
  }

  progressBar() {
    this.bar = 0;
    if (this.address !== null) {
      this.bar += 10;
    }
    if (this.firstName !== null) {
      this.bar += 10;
    }
    if (this.lastName !== null) {
      this.bar += 10;
    }
    if (this.careerLevel !== null) {
      this.bar += 10;
    }
    if (this.city !== null) {
      this.bar += 10;
    }
    if (this.dateOfBirth !== null) {
      this.bar += 10;
    }
    if (this.dateOfJoin !== null) {
      this.bar += 10;
    }
    if (this.Id !== null) {
      this.bar += 10;
    }
    if (this.state !== null) {
      this.bar += 10;
    }
    if (this.skills !== null) {
      this.bar += 10;
    }
  }

  makeEmail() {
    let email = '';
    email += this.firstName.charAt(0).toLowerCase();
    email += this.lastName.toLowerCase();
    email += '@wmp.com';
    this.email = email;
  }

  getOptions() {
    this.http
      .get(this.apiUrl + '/v1/api/skills')
      .pipe(map((res: Response) => res.json()))
      .subscribe(items => {
        this.defaultOptions = [];
        for (let i = 0; i < items.length; i++) {
          this.defaultOptions[i] = { id: i, name: items[i] };
        }
        this.castToMultiSelect(this.employee.skills);
      });
  }

  getEmployee() {
    return this.http
      .get(this.apiUrl + '/getEmployee/' + this.Id)
      .pipe(map((res: Response) => res.json()))
      .subscribe(employee => {
        this.refreshUI(employee, false);
      });
  }

  refreshUI(employee, update) {
    this.employee = employee;
    this.firstName = employee.firstName;
    this.lastName = employee.lastName;
    this.careerLevel = employee.careerLevel;
    if (
      employee.dateOfBirth != null &&
      typeof employee.dateOfBirth === 'string'
    ) {
      this.dateOfBirth = employee.dateOfBirth.substring(0, 10);
    }
    if (
      employee.dateOfJoin != null &&
      typeof employee.dateOfBirth === 'string'
    ) {
      this.dateOfJoin = employee.dateOfJoin.substring(0, 10);
    }
    this.address = employee.address;
    this.state = employee.state;
    this.city = employee.city;
    this.zipcode = employee.zipcode;
    if (!update) {
      this.castToMultiSelect(employee.skills);
    }
    this.showAddressChange();
    this.makeEmail();
    this.progressBar();
  }

  castToMultiSelect(skills) {
    this.skills = [];
    for (let i = 0; i < skills.length; i++) {
      for (let j = 0; j < this.defaultOptions.length; j++) {
        if (this.defaultOptions[j].name === skills[i]) {
          this.skills[i] = this.defaultOptions[j].id;
        }
      }
    }
  }

  showAddressChange() {
    this.employee.address != null &&
    this.employee.state != null &&
    this.employee.city != null &&
    (this.employee.zipcode != null || this.employee.zipcode != null)
      ? (this.showAddress = true)
      : (this.showAddress = false);
  }

  convertSkillsArray() {
    let newSkills;
    newSkills = [];
    if (this.skills != null) {
      for (let i = 0; i < this.skills.length; i++) {
        newSkills[i] = this.getSkill(this.skills[i]);
      }
    }
    return newSkills;
  }

  getQueryItems() {
    const values = [];
    let i = 0;
    for (let j = 0; j < this.items.length; j++) {
      if (this.items[j].value != null) {
        values[i++] = this.items[j].value;
      }
    }
    if (this.skills != null) {
      for (let j = 0; j < this.skills.length; j++) {
        values[i++] = this.getSkill(this.skills[j]);
      }
    }
    return values;
  }

  getSkill(id) {
    for (let i = 0; i < this.defaultOptions.length; i++) {
      if (id === this.defaultOptions[i].id) {
        return this.defaultOptions[i].name;
      }
    }
    return '';
  }

  compSearch() {
    const queries = new Object();
    queries['strings'] = this.getQueryItems();
    if (queries['strings'] === undefined || queries['strings'].length === 0) {
      return this.getAll();
    }
    return this.httpclient
      .post(this.apiUrl + '/v1/api/employees', queries, this.options)
      .subscribe(employees => {
        if (employees !== null) {
          this.data = employees;
          this.showToast('success', 'Searching by ' + queries['strings']);
        }
      });
  }

  save() {
    if (
      this.firstName === null ||
      this.lastName === null ||
      this.careerLevel === null
    ) {
      this.showToast('error', 'Not saved. Missing required information');
    } else {
      const employeeJson = this.makeEmployeeJSON();
      const skillsJson = this.makeSkillJSON();
      this.httpclient
        .post(this.apiUrl + '/v1/api/employees', employeeJson, this.options)
        .subscribe(result => {
          this.resultId = result['id'];
          this.httpclient
            .post(
              this.apiUrl + '/api/skills/' + this.resultId,
              skillsJson,
              this.options
            )
            .subscribe(finalResult => {
              this.saved = true;
              this.router.navigate(['/employee', { id: this.resultId }]);
              this.showToast(
                'success',
                'Created ' + this.firstName + ' ' + this.lastName
              );
            });
        });
    }
  }

  updateEmployee() {
    if (
      this.firstName === null ||
      this.lastName === null ||
      this.careerLevel === null
    ) {
      this.showToast('error', 'Not updated. Missing required information');
    } else {
      const employeeJson = this.makeEmployeeJSON();
      this.httpclient
        .put(
          this.apiUrl + '/v1/api/employees' + this.Id,
          employeeJson,
          this.options
        )
        .subscribe(result => {
          result['skills'] = this.convertSkillsArray();
          this.refreshUI(result, true);
        });
      const skillsJson = this.makeSkillJSON();
      this.httpclient
        .delete(this.apiUrl + '/api/skills/' + this.Id, this.options)
        .subscribe(result => {
          this.httpclient
            .post(
              this.apiUrl + '/api/skills/' + this.Id,
              skillsJson,
              this.options
            )
            .subscribe(finalResult => {
              this.employee.skills = this.convertSkillsArray();
              this.showToast(
                'success',
                'Updated ' + this.firstName + ' ' + this.lastName
              );
            });
        });
    }
  }

  deleteEmployee() {
    this.httpclient
      .delete(this.apiUrl + '/api/skills/' + this.Id, this.options)
      .subscribe(result => {
        this.httpclient
          .delete(this.apiUrl + '/api/employees/' + this.Id, this.options)
          .subscribe(finalResult => {
            this.showToast(
              'success',
              'Deleted ' + this.firstName + ' ' + this.lastName
            );
            this.router.navigate(['/employee']);
          });
      });
  }

  makeEmployeeJSON() {
    const employeeJson = new Object();
    employeeJson['firstName'] = this.firstName;
    employeeJson['lastName'] = this.lastName;
    employeeJson['address'] = this.address;
    employeeJson['city'] = this.city;
    employeeJson['state'] = this.state;
    employeeJson['zipcode'] = this.zipcode;
    employeeJson['dateOfBirth'] = this.dateOfBirth;
    employeeJson['dateOfJoin'] = this.dateOfJoin;
    employeeJson['careerLevel'] = this.careerLevel;
    employeeJson['skills'] = this.convertSkillsArray();
    return employeeJson;
  }

  makeSkillJSON() {
    const skillsJson = new Object();
    skillsJson['skills'] = this.convertSkillsArray();
    return skillsJson;
  }

  clear() {
    this.employee = new Employee();
    this.firstName = null;
    this.lastName = null;
    this.careerLevel = null;
    this.dateOfBirth = null;
    this.dateOfJoin = null;
    this.address = null;
    this.state = null;
    this.city = null;
    this.zipcode = null;
    this.skills = [];
  }

  open(content, options = {}) {
    this.modalService.open(content, options).result.then(
      result => {
        console.log(`Closed with: ${result}`);
      },
      reason => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onChange(event) {
    this.compSearch();
  }

  getAll() {
    return this.http
      .get(this.apiUrl + '/v1/api/skill-set/getAll')
      .pipe(map((res: Response) => res.json()))
      .subscribe(data => {
        this.data = data;
      });
  }

  showToast(type, message) {
    this.type = type;
    const options = {
      tapToDismiss: this.tapToDismiss,
      closeButton: this.closeButton,
      progressBar: this.progressBar2,
      progressAnimation: this.progressAnimation,
      positionClass: this.positionClass,
      rtl: this.appService.isRTL
    };
    this.toastrService.toastrConfig.newestOnTop = this.newestOnTop;
    this.toastrService.toastrConfig.preventDuplicates = this.preventDuplicates;
    this.toastrService[this.type](this.message || message, this.title, options);
  }
}
