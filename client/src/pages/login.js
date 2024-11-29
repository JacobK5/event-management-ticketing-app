import React from "react";

const Login = () => {
    return (
      <main className="center-content">
        <form class="form_box">
          <label class="form_title">Login: </label>
          <label class="input_title">
            Username: 
            <input class="form-group"
              type="text"
              name="username"
              required
            />
          </label>
          <label class="input_title">
            Password: 
            <input class="form-group"
              type="password"
              name="password"
              required
            />
          </label>
        </form>
        <div  style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
          <button class = "submit" type="submit">Submit</button> 
          <a href="#" >Register</a>
        </div>
        
      </main>
      
    );
  };
  
  export default Login;
  