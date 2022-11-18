import React, { useState } from "react";
import { updateDoc, deleteDoc, doc } from "@firebase/firestore";
import { dbService, storageService } from "fBase";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetOBJ: { id, text, attachmentUrl }, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want delete this nweet?");
    if (ok) {
      await deleteDoc(doc(dbService, `nweets/${id}`));
      await deleteObject(ref(storageService, attachmentUrl));
    }
  };

  const toggleEditing = () => setEditing((prevEditing) => !prevEditing);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(dbService, `nweets/${id}`), {
      text: newNweet,
    });
    setEditing(false);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit} className="container nweetEdit">
                <input
                  type="text"
                  placeholder="Edit your nweet"
                  value={newNweet}
                  onChange={onChange}
                  required
                />
                <input type="submit" value="Update Nweet" className="formBtn" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{text}</h4>
          {attachmentUrl && (
            <img
              src={attachmentUrl}
              width="50px"
              height="50px"
              alt="upload file"
            />
          )}
          {isOwner && (
            <div className="nweet_action">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Nweet;
