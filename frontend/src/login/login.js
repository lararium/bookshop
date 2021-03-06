import React, { Component } from 'react'
import "./Login.css";
import Cookies from 'js-cookie'
import { Redirect} from "react-router-dom";

export default class Login extends Component {
  constructor (props) {
    super(props);
    this.state = {
      emailOrUsername:"",
      password:"",
      token:"",
      data : [],
      redirect: false,
      roles : []

    }
  }

  setRedirect = () => {
    this.setState({
      redirect: !this.state.redirect
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />
    }
  }
  changeEmailOrUsername = (e) =>{
    this.setState({
      emailOrUsername:e.target.value,
    });
  }
changePassword = (e) =>{
  this.setState({
    password:e.target.value,
  });
}

   async getCurrentUserRoles(){
      await fetch('http://localhost:5000/api/user/roles',{
      method: 'get',
      headers: {'Content-Type':'application/json',
                "Authorization":Cookies.get("token"),
    },
    }).then(response => response.json())
    .then(data => data.map((role) => this.setState(({
      roles: [...this.state.roles, role['authority']]
    }))
    ))
  }


async loginUserFromLoginPage(data){
    console.log(data)
    if(data['accessToken'] != null && data['accessToken'] != ""){
      await Cookies.set("token" ,"Bearer " + data['accessToken'])
      await ( this.getCurrentUserRoles())
      console.log(this.state.roles)
      if (this.state.roles != "" && this.state.roles != []   && this.state.roles != null ) {
          this.setRedirect('/home');

        }
    }

  }
  componentWillMount(){
    this.loginUserFromCookie();
  }

   async loginUserFromCookie() {
    if(Cookies.get('token') != null && Cookies.get('token') != ''){
      (await this.getCurrentUserRoles())
      if (this.state.roles != "" && this.state.roles != []   && this.state.roles != null ) {
          this.setRedirect();

        }
    }
  
  }

  async login (e){
    e.preventDefault();
   await fetch('http://localhost:5000/api/auth/signin', {
    method: 'post',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      usernameOrEmail: this.state.emailOrUsername,
      password: this.state.password,
    })
   }).then(response => response.json())
   .then(  data =>(this.loginUserFromLoginPage(data)))
   .catch(error => console.log(error));  
}

 
  render() {


    return (
      
      <div className=" login-container">
                {this.renderRedirect()}

        <center>
            <div className="login-container2">
                <div className="login-form">
                  <div className="login-form-1">
                    <h3 >Login</h3>
                    <div>
                        <div className="form-group">
                            <input type="text" className="form-control" onChange={this.changeEmailOrUsername} placeholder="Your Email *"  />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" onChange={this.changePassword} placeholder="Your Password *"  />
                        </div>
                        <div className="form-group">
                            <input type="submit" className="btnSubmit" value="Login" onClick={this.login.bind(this)} />
                        </div>
                        <div className="form-group">
                            <input type="submit" className="btnSubmit" value="Login" onClick={this.getCurrentUserRoles.bind(this.getCurrentUserRoles)} />
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            </center>
        </div>
    )
  }
}


