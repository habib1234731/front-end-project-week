import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;

export const CHECK_IF_AUTHENTICATED = "CHECK_IF_AUTHENTICATED";

export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";

export const authError = error => {
  return {
    type: AUTHENTICATION_ERROR,
    payload: error
  };
};

export const USER_REGISTERED = "USER_REGISTERED";

export const register = (
  username,
  password,
  confirmPassword,
  firstName,
  lastName,
  history
) => {
  return dispatch => {
    if (password !== confirmPassword) {
      dispatch(authError("Passwords do not match. Watchu tryna do..?"));
      return;
    }
    axios
      .post("https://serverlambda.herokuapp.com/", {
        // .post("http://lo1calhost:5000/",{
        username,
        password,
        firstName,
        lastName
      })
      .then(() => {
        dispatch({ type: USER_REGISTERED });
        history.push("/");
      })
      .catch(() => {
        dispatch(
          authError(
            "Failed to register the user."
          )
        );
      });
  };
};

export const USER_AUTHENTICATED = "USER_AUTHENTICATED";

export const login = (username, password, history) => {
  return dispatch => {
    axios
      .post("https://serverlambda.herokuapp.com/login", { username, password })
      // .post("http://localhost:5000/login", { username, password })
      .then(response => {
        console.log("data:", response.data, "response:", response);
        const token = response.data.token;
        const uid = response.data.uid;
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("uid", uid);
        dispatch({
          type: USER_AUTHENTICATED
        });
        history.push(`${uid}/displayNotes`);
      })
      .catch(() => {
        dispatch(authError("Incorrect username/password."));
      });
  };
};

export const USER_UNAUTHENTICATED = "USER_UNAUTHENTICATED";

export const logout = () => {
  return dispatch => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("uid");
    dispatch({
      type: USER_UNAUTHENTICATED
    });
  };
};

export const ADD_NOTE = "ADD_NOTE";
//let noteId = 10;

export const addNote = note => {
  const token = window.localStorage.getItem("token");
  const uid = window.localStorage.getItem("uid");
  return dispatch => {
    axios
      .post(`https://serverlambda.herokuapp.com/${uid}/createNote`, note, {
        // .post(`http://localhost:5000/${uid}/createNote`, note, {
        headers: { 'Authorization': "Bearer " + token }
      })
      .then(({ note }) => {
        dispatch({
          type: ADD_NOTE,
          payload: note
        });
      })
      .catch(error => {
        dispatch(authError("There was an error creating the note"));
      });
  };
};

export const GET_NOTES = "GET_NOTES";

export const getNotes = () => {
  const token = window.localStorage.getItem("token");
  const uid = window.localStorage.getItem("uid");
  console.log("In the getNotes function, printing the uid: ", uid);
  return dispatch => {
    axios
      .get(`https://serverlambda.herokuapp.com/${uid}/displayNotes`, {
      // .get(`http://localhost:5000/${uid}/displayNotes`, {
        headers: { 'Authorization': "Bearer " + token }
      })
      .then(({ data }) => {
        console.log("data fromt the get request in getNotes:", data);
        dispatch({
          type: GET_NOTES,
          payload: data
        });
      })
      .catch(error => {
        dispatch(authError("There was an error getting the notes"));
      });
  };
};

export const EDIT_NOTE = "EDIT_NOTE";

export const editNote = note => {
  const token = window.localStorage.getItem("token");
  const uid = window.localStorage.getItem("uid");
  console.log("Note(143):",note);
  return dispatch => {
    const id = note._id;
    axios
      .put(`https://serverlambda.herokuapp.com/editNote/${id}`, note, {
        // .put(`http://localhost:5000/editNote/${id}`, note, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      .then(({ data }) => {
        dispatch({
          type: EDIT_NOTE,
          payload: data
        });
      })
      .catch(error => {
        dispatch(authError("There was an error editing/updating the note"));
      });
  };
};

export const DELETE_NOTE = "DELETE_NOTE";

export const deleteNote = id => {
  const token = window.localStorage.getItem("token");
  const uid = window.localStorage.getItem("uid");
  console.log("note id to be deleted: ", id);
  return dispatch => {
    axios
      .delete(`https://serverlambda.herokuapp.com/deleteNote/${id}`, {
        // .delete(`http://localhost:5000/deleteNote/${id}`, {
        headers: { 'Authorization': "Bearer " + token }
      })
      .then(({ data }) => {
        dispatch({
          type: DELETE_NOTE,
          payload: data
        });
      })
      .catch(error => {
        dispatch(authError("There was an error deleting the note"));
      });
  };
};
