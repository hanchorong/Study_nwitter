import React, { useEffect, useState } from "react";
import { dbService } from "fBase";
import { collection, query, onSnapshot, orderBy } from "@firebase/firestore";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
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

  return (
    <>
      <div>
        <NweetFactory userObj={userObj} />

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
