import React, { useState } from "react";
import { updateDoc, deleteDoc, doc } from "@firebase/firestore";
import { dbService } from "fBase";

const Nweet = ({ nweetOBJ: { id, text }, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(text);

  const onClickDelete = async () => {
    const ok = window.confirm("Are you sure you want delete this nweet?");
    if (ok) {
      await deleteDoc(doc(dbService, `nweets/${id}`));
    }
  };

  const toggleEditing = () => {
    setEditing((prevEditing) => !prevEditing);
  };

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
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <h4>{text}</h4>
      )}
      {isOwner && (
        <>
          <button onClick={onClickDelete}>Delete Nweet</button>
          <button onClick={toggleEditing}>Edit Nweet</button>
        </>
      )}
    </div>
  );
};
export default Nweet;
