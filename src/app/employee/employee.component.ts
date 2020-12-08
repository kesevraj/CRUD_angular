import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl,Validators} from '@angular/forms';
import { Location } from '@angular/common';
// import { PasswordStrengthValidator } from "./password-strength.validators"

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
 cards;

  constructor(private http:HttpClient,private location: Location) {
    
  
  this.http.get("http://localhost:3000/details")
  .subscribe((data)=>{
    console.log(data)
    this.cards=data
    // alert("ok")
  })
  

  // console.log(this.data.controls.Name.valid,"ilyry")
  }

  ngOnInit() {
 
  }

 Name=""
@Input() email=""
@Input() pass=""

 //getting values from form
 data = new FormGroup({
  Name: new FormControl('',[Validators.required]),
  email: new FormControl('',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')]),
  password: new FormControl('',[Validators.required,, Validators.pattern('^[0-9+]*'), Validators.maxLength(10)]),
});

//insert the value to database
add(email: string){
  console.log(email)
  // console.log(this.data.value)
    this.http.post("http://localhost:3000/data/"+email,this.data.value)
    .subscribe(
      (data:any)=>{
      if(data.mess=="inserted data in data base"){
        location.reload();
      }
      else  alert(data.mess);
      // console.log(data)
    }, error => {
        console.log(error);
    }
    )
  
    // console.log(this.data.valid)
    // console.log(this.data.controls.Name.valid)

  }

  del(id: string){
  // console.log(id)
  // alert("do u really want to delete")
  if(confirm("Are you sure to delete these data")) {
    this.http.delete("http://localhost:3000/data/"+id)
  .subscribe()
  location.reload();
  }
  // this.http.delete("http://localhost:3000/data/"+id)
  // .subscribe()
  // location.reload();
  }

  updateval: boolean;

  up(id: string){
    // console.log("http://localhost:3000/setval/"+id)
    // this.data.setValue(
    //   { Name: "velu", email: "Mohan@gmail.com", password: "12344"},
    // );
    this.http.put("http://localhost:3000/setval/"+id,this.data.value)
    .subscribe(
      (data:any)=>{
         this.data.setValue(
      { Name: data.Name, email: data.email, password: data.password},
    );
      // alert(data.Name);
    }, error => {
        console.log(error);
    }
    )
    // location.reload();
    // var bt=document.getElementById("submitbt")
    // bt.setAttribute("onclick",`update(${id})`)
     this.updateval=true;
  }

  update(id: string){
    console.log(id)
    this.http.put("http://localhost:3000/update/"+id,this.data.value)
    .subscribe(
      (data:any)=>{
      if(data.mess=="updated sucessfully"){
        location.reload();
      }
      else  {  
        // alert(data.mess);
        if(confirm("do u want to create new data")) { 
          this.add(id)
        }

      }
    }, error => {
        console.log(error);
    }
    )
    this.updateval=false;
  }

}

