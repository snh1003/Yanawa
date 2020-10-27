import React, { useEffect } from "react";
import MainWrapper from "../../UI/Wrapper/mainWrapper";
import TopWrapper from "../../UI/Wrapper/TopWrapper";
import MiddleWrapper from "../../UI/Wrapper/MiddleWrapper";
import FeedCard from "../../UI/FeedCard";
import BottomWrapper from "../../UI/Wrapper/BottomWrapper";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
import { throttle } from "lodash";

import {
  Dispatcher,
  Feed,
  useDispatch,
  useProfileState,
} from "../../Context/ProfileContext";

const FeedComponent = () => {
  const state = useProfileState();
  const dispatch = useDispatch();
  const [feedData, setFeedData] = React.useState<Feed[]>([]);

  const getParameterByName = (name: string) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(window.location.search);
    return results == null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  const getToken = async () => {
    const tokenCode = getParameterByName("code");
    const formdata = new URLSearchParams();
    formdata.append("client_id", "884820475384123");
    formdata.append("client_secret", "df63c18525f145a62ed77e965e152c25");
    formdata.append("grant_type", "authorization_code");
    formdata.append("redirect_uri", "https://localhost:3000/feed");
    formdata.append("code", tokenCode);

    try {
      const token = await axios
        .post("https://api.instagram.com/oauth/access_token", formdata)
        .then((res) => {
          return JSON.parse(JSON.stringify(res.data.access_token));
        });
      return token;
    } catch (e) {
      dispatch({ type: "GET_PROFILE_ERROR", error: e });
    }
  };

  const getProfile = async (dispatch: Dispatcher, token: string) => {
    dispatch({ type: "GET_PROFILE" });
    try {
      const response = await axios
        .get(
          `https://graph.instagram.com/me?fields=id,username&access_token=${token}`
        )
        .then((res) => JSON.parse(JSON.stringify(res.data)));
      dispatch({ type: "GET_PROFILE_SUCCESS", data: response });
    } catch (e) {
      dispatch({ type: "GET_PROFILE_ERROR", error: e });
    }
  };

  const getFeed = async () => {
    await axios
      .get(`https://localhost:80/?limit=${feedData.length + 10}`)
      .then((res) => {
        setFeedData(res.data);
      })
      .catch((e) => {
        console.log(e);
        throw new Error(e);
      });
  };

  const getFeedOne = async (id: string) => {
    await axios;
  };

  const delayedQuery = React.useCallback(throttle(getFeed, 500), [
    feedData.length,
  ]);

  useEffect(() => {
    // getToken().then((r) => getProfile(dispatch, r));
    getFeed();
  }, []);

  return (
    <MainWrapper>
      <TopWrapper username={state.data?.username} />
      <MiddleWrapper>
        <InfiniteScroll
          pageStart={0}
          loadMore={delayedQuery}
          hasMore={true || false}
          useWindow={false}
          loader={
            <div key="loading" className="loader">
              Loading ...
            </div>
          }
        >
          {feedData?.map((value) => {
            return (
              <FeedCard
                key={value.id}
                title={value.title}
                tag={value.tag}
                day={value.day}
              />
            );
          })}
        </InfiniteScroll>
      </MiddleWrapper>
      <BottomWrapper />
    </MainWrapper>
  );
};

export default FeedComponent;
