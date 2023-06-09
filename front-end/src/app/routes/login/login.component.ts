import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/User/login.model';
import { LoadingComponent } from '../common/loading/loading.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild(LoadingComponent, { static: false }) loading!: LoadingComponent;
  userName!: string;
  passWord!: string;
  validateForm!: UntypedFormGroup;
  dto: Login = new Login();
  passwordVisible = false;

  constructor(
    private _login: LoginService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      passWord: [null, [Validators.required]],
    });
  }

  submitForm() {
    this.loading.loading(true);
    this._login.checkUser(this.validateForm.value)?.pipe(finalize(() => {
      this.loading.loading(false);
    })).subscribe((res: any) => {
      if (res.statusCode == 200) {
        localStorage.setItem('user', JSON.stringify(res.data))
        sessionStorage.setItem('user', JSON.stringify(res.data))
        if (res.data.role == 1) {
          this.router.navigateByUrl('nav-bar/dashboard');
        } else {
          this.router.navigateByUrl('nav-bar/home');
        }
        this.toastr.success('Login susscess!');
      }
    })
  }

  handleEnterKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.submitForm();
    }
  }
}
