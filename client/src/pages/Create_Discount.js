import React, { useState } from "react";

const Create_Discount = () => {
  // note: will need to specify event that discount is for and the tiers of tickets it applies to
  // (since we need to link codes to specific tickets)
  return (
    <>
      <main className="center-content">
        <div>
          <h2 className="form_title">Create Discount</h2>

          {/* Form to fill in user details */}
          <form className="form_box">
            <label className="input_title">
              Dicount id:
              <input className="form-group" type="text" name="name" required />
            </label>

            <label className="input_title">
              Max Uses:
              <input className="form-group" type="text" name="name" required />
            </label>

            <label className="input_title">
              Discount Ammount:
              <input className="form-group" type="text" name="name" required />
            </label>

            {/* // uploads discount information ad brings to view discounts page */}
            <button className="submit" type="submit">
              Submit
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Create_Discount;
