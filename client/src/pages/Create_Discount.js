import React, { useState } from "react";

const Create_Discount = () => {
  return (
    <>
      <main className="center-content">
        <div>
        <h2 class="form_title">Create Discount</h2>
        
        {/* Form to fill in user details */}
        <form class="form_box">
          <label class="input_title">
            Dicount id: 
            <input class="form-group"
              type="text"
              name="name"
              required
            />
          </label>

          <label class="input_title">
            Max Uses: 
            <input class="form-group"
              type="text"
              name="name"
              required
            />
          </label>

          <label class="input_title">
            Discount Ammount: 
            <input class="form-group"
              type="text"
              name="name"
              required
            />
          </label>

         
            {/* // uploads discount information ad brings to view discounts page */}
          <button class = "submit" type="submit">Submit</button>
        </form>
      </div>
      </main>
    </>
    
    
  );
};

export default Create_Discount;
