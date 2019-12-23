import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {Response} from "../interfaces/response";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() isAdminPanel: boolean = false;

  loginForm: FormGroup;
  registerForm: FormGroup;
  isWrongCred:boolean = false;
  serverRes: Response;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      login: ['', [
        Validators.required,
        Validators.pattern(/^\S*[A-z0-9]$/)
      ]],
      password: ['', [
        Validators.required
      ]]
    });

    this.registerForm = this.formBuilder.group({
      login: ['', [
        Validators.required,
        Validators.pattern(/^\S*[A-z0-9]$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    },
      {validator: this.matchPassword}
      );
  }

  matchPassword(formGroup: FormGroup){
    const password = formGroup.controls['password'].value;
    const confirmPassword = formGroup.controls['confirmPassword'].value;
    if (confirmPassword && confirmPassword.length) {
      return (password === confirmPassword) ? null : {'mismatch': true}
    }
  }

  resetForm(event) {
    if (event.index) {
      this.loginForm.reset();
    }
    else {
      this.registerForm.reset();
    }
    if(this.serverRes) {
      this.serverRes = undefined;
    }
  }

  onSubmit(form: FormGroup) {
    const controls = form.controls;
    if (form.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      this.isWrongCred = true;
      setTimeout(() => {this.isWrongCred = false;},2000);
      return;
    }
    const data = form.value;
    //login
    if (form === this.loginForm) {
      this.authService.isLoggedIn().then(status =>{
        if (!status) {
          this.authService.login(data).then(response => {
            this.serverRes = response;
          });
        }
      });
      // this.authService.login(data).subscribe((data: Response) => {
      //
      // })
      // let promise = new Promise((res, rej) => {
      //   this.authService.login(data).subscribe((data: Response) => {
      //     res(data);
      //   });
      // });
      // promise.then((result: Response) => {
      //   this.authService.isLoggedIn().subscribe(status => {
      //     this.serverRes = result;
      //     if (!status && result.ok) {
      //       this.authService.status.next(true);
      //       localStorage.setItem('isLoggedIn', 'true');
      //       localStorage.setItem('userName', form.value['login']);
      //       this.router.navigate(['/chat']);
      //     }
      //   });
      // }).catch(err => {
      //   this.serverRes = {
      //     ok: false,
      //     caption: 'Ошибка входа. Попробуйте позже!'
      //   }
      // })
    }
    //register
    else {
      this.authService.register(data).subscribe((data: Response) => {
        this.serverRes = data;
      });
    }
  }

  get login(): any { return this.loginForm.get('login')};
  get password(): any { return this.loginForm.get('password')}

  get regLogin(): any { return this.registerForm.get('login')};
  get regPassword(): any { return this.registerForm.get('password')}
  get confPassword(): any { return this.registerForm.get('confirmPassword')}

}
