import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AuthService } from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() isAdminPanel: boolean = false;

  loginForm: FormGroup;
  private isWrongCred:boolean = false;
  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.loginForm = this.fb.group({
      login: ['', [
        Validators.required,
        Validators.pattern(/[A-z]/)
      ]]
    });
  }

  onSubmit() {
    const controls = this.loginForm.controls;
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      this.isWrongCred = true;
      return;
    }
    this.isWrongCred = false;
    this.authService.login(this.loginForm.value['login']);
    this.router.navigate(['/chat']);
  }

}
