import React, { useEffect, useState } from "react";
import { dbService } from "fBase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "@firebase/firestore";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  // console.log(userObj);
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

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

    const docRef = await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
    });
    console.log("Document written with ID:", docRef.id);

    setNweet("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

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
          <input type="submit" value="Nweet" />
        </form>
        <div>
          {nweets.map((nweet) => (
            <Nweet key={nweet.id} nweetOBJ={nweet} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
