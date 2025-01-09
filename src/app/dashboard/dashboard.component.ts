import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  EmailID: string = "shubhambanne1819@gmail.com";
  phoneNo: string ="+91 8999661297 ";
  location: string = "Pune, India";
  linkedInProfile: string ="https://www.linkedin.com/in/shubham-banne77981297271969780123";
  gitHubProfile: string = "https://github.com/ShubhamBanne19";
}
