import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./JwtToken";
import Expenses from "./Expenses";

const calculateDaysAgo = (lastModifiedTimestamp) => {
  const currentTimestamp = Date.now();
  const differenceInMilliseconds = currentTimestamp - lastModifiedTimestamp;

  // Convert milliseconds to days
  const daysAgo = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

  return daysAgo;
};

export default function GroupDatail({ group }) {
  const { token,setAuthToken,userId} = useAuth();
  const navigate = useNavigate();
  const daysAgo = calculateDaysAgo(group.lastModifiedAt);


  let deleteGroup = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_HOST}/deleteGroup/${group.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.reload();
      navigate("/retrieveGroups");
    } catch (error) {
      setAuthToken(null);
      localStorage.removeItem("token");
      navigate("/");
      console.error("Error deleting the group:", error.message);
    }
  };

  return (
    <div>
      <div
        className="list-group"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <div
          className="list-group-item list-group-item-action active"
          aria-current="true"
        >
          <div className="d-flex w-100 justify-content-between">
            <Link
              className="nav-link active"
              //to={"/retrieveExpense/" + group.id}
              to={`/retrieveExpense/${group.id}`}
              
            >
              <h4 className="mb-1"style={{textAlign:'left'}}>{group.name}</h4>
              <h5 className="mb-1" style={{textAlign:'left'}}>{group.description}</h5>
              <h6 style={{textAlign:'left'}}>Created by {userId==group.createdBy.email?"Me":group.createdBy.name}</h6>
            </Link>
            <small>Modified {daysAgo} days ago</small>
            
            
          </div>
        </div>
       <div className="btn-group">
       <button
            className="btn btn-sm btn-danger"
            onClick={deleteGroup}
            disabled={userId==group.createdBy.email?false:true}
          >
            Delete
          </button>
          <Link to={"/SettleUp/"+group.id}>
          <button className="btn btn-sm btn-secondary" >SettleUp</button></Link>
        </div>
      </div>
      <br />
    </div>
  );
}
