import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fBase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
  addDoc,
} from "@firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  //실시간으로 데이터를 데이터베이스에서 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const nextNweets = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setNweets(nextNweets);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";

    if (attachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const nweetObj = {
      text: nweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, "nweets"), nweetObj);

    setNweet("");

    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (e) => {
    // console.log(e.target.files);
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      // console.log(finishedEvent);
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearPhoto = () => setAttachment("");

  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
            onChange={onChange}
            value={nweet}
          />
          <input type="file" accept="image/*" onChange={onFileChange} />
          <input type="submit" value="Nweet" />
          {attachment && (
            <div>
              <img
                src={attachment}
                width="50px"
                height="50px"
                alt="prev upload"
              />
              <button onClick={onClearPhoto}>Clear</button>
            </div>
          )}
        </form>
        <div>
          {nweets.map((nweet) => (
            <Nweet
              key={nweet.id}
              nweetOBJ={nweet}
              isOwner={nweet.creatorId === userObj.uid}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
