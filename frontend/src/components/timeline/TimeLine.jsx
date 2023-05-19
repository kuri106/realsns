import React, { useContext, useEffect, useState } from 'react'
import Post from '../post/Post'
import Share from '../share/Share'
import "./TimeLine.css"
import { AuthContext } from '../../state/AuthContext'
//import {Posts} from "../../DummyData"
import axios from "axios"

export default function TimeLine({username}) {

  const [Posts, setPosts] = useState([]);

  const {user} = useContext(AuthContext);
  useEffect(() => {
    const fetchPosts = async () => {

      const response = username 
      ? await axios.get(`/posts/profile/${username}`) //プロフィールの場合
      : await axios.get(`/posts/timeline/${user._id}`); // Homeの場合
      //console.log(response);
      setPosts(response.data.sort((post1, post2) => {
        return new Date(post2.createdAt) - new Date(post1.createdAt);
      }));
    }
    fetchPosts();
  }, [username, user._id]);
  
  return (
    <div className="timeline">
      <div className="timelineWrapper">
        <Share />
        {Posts.map((post) => (
          <Post post={post} key={post._id}/>
        ))}
      </div>
    </div>
  )
}
