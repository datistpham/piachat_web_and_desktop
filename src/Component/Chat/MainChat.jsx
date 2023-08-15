import Cookies from "js-cookie";
import React, {
  useMemo,
  useState,
  useEffect,
  memo,
  Fragment,
  useContext,
} from "react";
import { Button } from "react-bootstrap";
import { GrClose } from "react-icons/gr";
import OutsideClickHandler from "react-outside-click-handler";
import { useParams } from "react-router-dom";
import add_member_to_group from "../../api/coversation/add_member_to_group";
import get_conversation_friends from "../../api/coversation/get_conversation_friends";
import out_group from "../../api/coversation/out_group";
import send_request_make_friend_by_me from "../../api/friend/send_request_make_friend_by_me";
import get_message_conversationid from "../../api/message/get_message_conversationid";
import search_user_by_phone from "../../api/search_user_by_phone";
import { AppContext } from "../../App";
import { SocketContainerContext } from "../../SocketContainer/SocketContainer";
import Avatar from "../Home/Avatar";
import CoverPhoto from "../Home/CoverPhoto";
import { NameProfile, ProfileInfo } from "../Home/DetailProfile";
import {
  ListFriendComponent,
  linearSearchByPhoneNumberAndUsername,
} from "../SearchAndList/ListFriend";
import ContentConversation from "./CenterSection/CenterSection";
import { BsThreeDots } from "react-icons/bs";
// import { MdCall, MdCallEnd } from "react-icons/md";
// import { v4 } from "uuid";
import { HomeContext } from "../Home/Home";
import { useRef } from "react";
import unfriend from "../../api/friend/unfriend";
import BottomSection from "./BottomSection/BottomSection";
import get_friend_status from "../../api/friend/request_status";
import cancel_request_make_friend_from_me from "../../api/friend/cancel_request_make_friend_from_me";
import accpet_add_friends from "../../api/friend/accpet_add_friends";
import denied_request_friends from "../../api/friend/denied_request_friends";
import { TextField } from "@mui/material";
import _ from "lodash";
import get_user from "../../api/admin/get_user";

const MainChat = (props) => {
  const refScroll = useRef()
  const [change, setChange]= useState(false)
  const query = useMemo(
    () => ({
      page: 1,
      limit: 9,
    }),
    []
  );
  const { socketState } = useContext(SocketContainerContext);
  const { idConversation } = useParams();
  // useEffect(() => {
  //   socketState.emit("join_room_conversation", { roomId: idConversation });
  // }, [socketState, idConversation]);

  const [contentText, setContentText] = useState(() => "");
  const [listMessage, setListMessage] = useState(() => []);
  useEffect(() => {
    get_message_conversationid(idConversation, setListMessage, query);
  }, [idConversation, query]);

  useEffect(() => {
    socketState.on("broadcast_to_all_user_in_room", (data) => {
      setListMessage((prev) => [...prev, data]);
    });
  }, [socketState]);
  return (
    <div className={"jdahdjksdhjashasjfda"} style={{ flex: "1 1 0" }}>
      <div
        className={"fjskdjkfjdkjadkjsas"}
        style={{ width: "100%", height: "100%", maxHeight: "100vh" }}
      >
        <TitleMainChat
          setCallId={props?.setCallId}
          setIsCall={props?.setIsCall}
          isCall={props?.isCall}
          setExtend={props?.setExtend}
          setChange={props?.setChange}
          {...props?.conversation}
          avtChat={props?.conversation?.imageGroup}
          name={props?.conversation?.label}
          setVideo={props?.setVideo}
          setAudio={props?.setAudio}
        />
        {/*  */}

        <ContentConversation refScroll={refScroll} listMessage={listMessage} />

        {/*  */}

        <BottomSection
          refScroll={refScroll}
          contentText={contentText}
          setContentText={setContentText}
        />
      </div>
    </div>
  );
};

export const TitleMainChat = memo((props) => {
  const [open, setOpen] = useState(false);
  // const {idConversation }= useParams()
  const { socketState } = useContext(SocketContainerContext);
  const { setInComingCall } = useContext(HomeContext);
  // const callId = useMemo(() => v4().replaceAll("-", ""), []);
  // const { data } = useContext(AppContext);
  useEffect(() => {
    socketState.on("end_call_from_sender", () => {
      setInComingCall(() => false);
    });
  }, [socketState, setInComingCall]);
  return (
    <div
      className={"fdjdhsdjkvhsjkhaassa"}
      style={{
        width: "100%",
        height: 60,
        borderBottom: "1px solid #e7e7e7",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        className={"fkjdjkdjdkjdkssa"}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={
            props.imageGroup
              ? props.imageGroup
              : props?.member?.filter(
                  (item) => item?._id !== localStorage.getItem("uid")
                )?.[0]?.profilePicture?.length > 0
              ? props?.member?.filter(
                  (item) => item?._id !== localStorage.getItem("uid")
                )?.[0]?.profilePicture
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt="Can't open"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #d7d7d7",
          }}
        />
        <div
          className={"fjsdhjgjkdksdas"}
          style={{ fontWeight: 600, fontSize: 18 }}
        >
          {props.label
            ? props.label
            : props?.member?.filter(
                (item) => item?._id !== localStorage.getItem("uid")
              )?.[0]?.username}
        </div>
        {open === true && (
          <PopupAddFriends
            is_show_info_group={true}
            open={open}
            setOpen={setOpen}
            socketState={socketState}
            {...props}
          />
        )}
      </div>
      {/* call */}
      <div
        className={"fjskdjskdfjsksd"}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* end call */}
        {/* {props?.isCall === true && (
          <>
            <div
              onClick={() => {
                props?.setIsCall(() => false);
                socketState.emit("sender_end_call", { call_id: callId });
              }}
              title={"Kết thúc cuộc gọi"}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 40,
                height: 40,
                background: "#f2f0f5",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <MdCallEnd style={{ width: 24, height: 24 }} />
            </div>
          </>
        )}

        {props?.isCall === false && (
          <>
            <div
              onClick={() => {
                props?.setAudio(() => true);
                props?.setVideo(() => false);
                socketState.emit("start_call", {
                  idConversation,
                  call_id: callId,
                  user_to_call: props?.member?.filter(
                    (item) => item?._id !== localStorage.getItem("uid")
                  )?.[0]?._id,
                  senderInfo: {
                    profilePicture: data?.profilePicture,
                    username: data?.username,
                  },
                });
                props?.setIsCall(() => true);
                props?.setCallId(() => callId);
              }}
              title={"Bắt đầu một cuộc gọi audio"}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 40,
                height: 40,
                background: "#f2f0f5",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <MdCall style={{ width: 24, height: 24 }} />
            </div>
            <div
              onClick={() => {
                props?.setAudio(() => true);
                props?.setVideo(() => true);
                socketState.emit("start_call", {
                  idConversation,
                  call_id: callId,
                  user_to_call: props?.member?.filter(
                    (item) => item?._id !== localStorage.getItem("uid")
                  )?.[0]?._id,
                  senderInfo: {
                    profilePicture: data?.profilePicture,
                    username: data?.username,
                  },
                });
                props?.setIsCall(() => true);
                props?.setCallId(() => callId);
              }}
              title={"Bắt đầu một cuộc gọi video"}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 40,
                height: 40,
                background: "#f2f0f5",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <BsFillCameraVideoFill style={{ width: 24, height: 24 }} />
            </div>
          </>
        )} */}
        <div
          onClick={() => props?.setExtend((prev) => !prev)}
          title={"Mở rộng"}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 40,
            height: 40,
            background: "#f2f0f5",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          <BsThreeDots style={{ width: 24, height: 24 }} />
        </div>
      </div>
    </div>
  );
});

export default MainChat;

export const PopupAddFriends = (props) => {
  const [isFriend, setIsFriend] = useState();
  const [isHostGroup, setIsHostGroup] = useState();
  const [change2, setChange2] = useState();
  // eslint-disable-next-line
  const [data2, setData2] = useState();
  const { setChange, data } = useContext(AppContext);

  useEffect(() => {
    if (props.createdBy) {
      if (localStorage.getItem("uid") === props?.createdBy) {
        setIsHostGroup(true);
      } else {
        setIsHostGroup(false);
      }
    }
  }, [props?.createdBy]);
  useEffect(() => {
    if (props._id) {
      get_conversation_friends(props._id, setData2);
    }
  }, [props._id, change2]);
  useEffect(() => {
    if (data2?.duplicate === false) {
      props?.socketState?.emit("send_request_friend", {
        destination_user_id: props?.member?.filter(
          (item) => item?._id !== localStorage.getItem("uid")
        )?.[0]?._id,
        sender_user_id: localStorage.getItem("uid"),
      });
    }
  }, [data2?.duplicate, props?.member, props?.socketState]);
  useEffect(() => {
    if (
      data?.friends?.includes(
        props?.member?.filter((item) => item?._id !== localStorage.getItem("uid"))?.[0]
          ?._id
      ) === true
    ) {
      setIsFriend(() => true);
    } else {
      setIsFriend(() => false);
    }
  }, [data?.friends, props?.member]);
  const [toAddMember, setToAddMember] = useState(false);
  const [searchMember, setSearchMember] = useState("");
  const [dataSearchMember, setDataSearchMember] = useState();
  // eslint-disable-next-line
  // eslint-disable-next-line
  const [resultAddMember, setResultAddMember] = useState();
  // eslint-disable-next-line
  const [friendsQueue, setFriendsQueue] = useState(data?.friendsQueue);
  const [friendStatus, setFriendStatus] = useState();
  const [toggleMakeFriend, setToggleMakeFriend] = useState(false);
  const [messageRequest, setMessageRequest] = useState(
    "Xin chào, tôi là " + data?.username
  );
  // eslint-disable-next-line
  const [profileUser, setProfileUser] = useState(
    props?.member?.filter((item) => item?._id !== localStorage.getItem("uid"))?.[0]
  );
  const [search, setSearch] = useState("");
  const isSearching = search.length > 0 ? true : false;
  const [dataSearch, setDataSearch] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await get_friend_status(
        props?.member?.filter((item) => item?._id !== localStorage.getItem("uid"))?.[0]
          ?._id
      );
      return setFriendStatus(result);
    })();
  }, [props?.member]);

  useEffect(() => {
    (async () => {
      const result = await get_user();
      let result1 = result?.filter((item) => item?._id !== localStorage.getItem("uid"));
      return setDataSearch(result1);
    })();
  }, []);

  return (
    <div
      className={"fkjldsklkdsslaskdsaa"}
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(0 ,0 ,0,0.3)",
        zIndex: 12,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OutsideClickHandler onOutsideClick={() => props.setOpen(() => false)}>
        <div style={{ overflow: "hidden", borderRadius: 10 }}>
          <div
            className={"fjlkdsjdkljsdklaskd"}
            style={{
              padding: 16,
              background: "#fff",
              borderRadius: 5,
              width: "100vw",
              maxWidth: 600,
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* 1 vs 1 */}
            <div style={{ width: "100%", height: "100%" }}>
              <div
                className={"jdjadkjgkddssa"}
                style={{
                  width: "100%",
                  height: 68,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  className={"dkldjskldjkasdasa"}
                  style={{ fontWeight: 600, fontSize: 18 }}
                >
                  {props.label
                    ? props.label
                    : props?.member?.filter(
                        (item) => item?._id !== localStorage.getItem("uid")
                      )?.[0]?.username}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    props?.setOpen(() => false);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: 10,
                  }}
                >
                  <GrClose />
                </div>
              </div>
              <CoverPhoto coverPhoto={props?.coverPhoto} />
              <Avatar
                avatar={
                  props.imageGroup
                    ? props.imageGroup
                    : props?.member?.filter(
                        (item) => item?._id !== localStorage.getItem("uid")
                      )?.[0]?.profilePicture
                }
              />
              <NameProfile
                username={
                  props.label
                    ? props.label
                    : props?.member?.filter(
                        (item) => item?._id !== localStorage.getItem("uid")
                      )?.[0]?.username
                }
              />
              {props?.member?.length <= 2 && (
                <>
                  {toggleMakeFriend === false && (
                    <ProfileInfo
                      user={{
                        gender: profileUser?.gender,
                        phoneNumber: profileUser?.phoneNumber,
                        address: profileUser?.address,
                      }}
                    />
                  )}
                </>
              )}

              <>
                <div
                  style={{
                    width: "100%",
                    // display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 16,
                    display: "none",
                  }}
                >
                  {/* is friend */}
                  {isFriend === true &&
                    !props?.label &&
                    data?.friends?.includes(
                      props?.member?.filter(
                        (item) => item?._id !== localStorage.getItem("uid")
                      )?.[0]?._id
                    ) === true && (
                      <Button
                        onClick={() => {
                          unfriend(
                            props?.member?.filter(
                              (item) => item?._id !== localStorage.getItem("uid")
                            )?.[0]?._id,
                            setData2
                          );
                          window.location.reload();
                        }}
                        variant="primary"
                      >
                        Hủy kết bạn
                      </Button>
                    )}
                  {/* is not friend */}
                  {!props?.label &&
                    data?.friends?.includes(
                      props?.member?.filter(
                        (item) => item?._id !== localStorage.getItem("uid")
                      )?.[0]?._id
                    ) === false && (
                      <>
                        {/* Receive friend request */}
                        {friendsQueue?.includes(
                          props?.member?.filter(
                            (item) => item?._id !== localStorage.getItem("uid")
                          )?.[0]?._id
                        ) === true && (
                          <>
                            <Button
                              disabled={
                                data2?.duplicate === true ? true : false
                              }
                              onClick={() =>
                                accpet_add_friends(
                                  props?.member?.filter(
                                    (item) => item?._id !== localStorage.getItem("uid")
                                  )?.[0]?._id,
                                  setData2
                                )
                              }
                              variant={"primary"}
                            >
                              {<>Chấp nhận</>}
                            </Button>
                            <Button
                              disabled={
                                data2?.duplicate === true ? true : false
                              }
                              onClick={() =>
                                denied_request_friends(
                                  props?.member?.filter(
                                    (item) => item?._id !== localStorage.getItem("uid")
                                  )?.[0]?._id,
                                  setData2
                                )
                              }
                              variant={"secondary"}
                            >
                              {<>Từ chối</>}
                            </Button>
                          </>
                        )}
                        {friendStatus?.request === true &&
                          friendStatus?.duplicate === true && (
                            <Button
                              disabled={
                                data2?.duplicate === true ? true : false
                              }
                              onClick={() => {
                                setToggleMakeFriend(() => false);
                                setFriendStatus({
                                  request: false,
                                  duplicate: false,
                                });
                                cancel_request_make_friend_from_me(
                                  props?.member?.filter(
                                    (item) => item?._id !== localStorage.getItem("uid")
                                  )?.[0]?._id,
                                  setChange
                                );
                              }}
                              variant={"secondary"}
                            >
                              {<>Hủy lời mời</>}
                            </Button>
                          )}

                        {/* are not friend */}

                        {friendsQueue?.includes(
                          props?.member?.filter(
                            (item) => item?._id !== localStorage.getItem("uid")
                          )?.[0]?._id
                        ) === false &&
                          friendStatus?.request === false && (
                            <>
                              {toggleMakeFriend === false && (
                                <Button
                                  disabled={
                                    data2?.duplicate === true ? true : false
                                  }
                                  onClick={() => {
                                    setToggleMakeFriend(() => true);
                                  }}
                                  variant={"primary"}
                                >
                                  {<>Thêm bạn bè</>}
                                </Button>
                              )}
                              {toggleMakeFriend === true && (
                                <>
                                  <div style={{ width: "100%" }}>
                                    <div
                                      style={{
                                        width: "100%",
                                        marginBottom: 12,
                                      }}
                                    >
                                      <textarea
                                        autoFocus
                                        value={messageRequest}
                                        onChange={(e) =>
                                          setMessageRequest(e.target.value)
                                        }
                                        style={{
                                          width: "100%",
                                          fontSize: 16,
                                          padding: 10,
                                          resize: "none",
                                          border: "1px solid #e7e7e7",
                                          outlineColor: "orange",
                                          maxHeight: 200,
                                          overflow: "auto",
                                        }}
                                        rows={4}
                                        cols={4}
                                      ></textarea>
                                    </div>
                                    <div
                                      className={"c-flex-center"}
                                      style={{ gap: 10 }}
                                    >
                                      <Button
                                        disabled={
                                          data2?.duplicate === true
                                            ? true
                                            : false
                                        }
                                        onClick={() => {
                                          setFriendStatus({
                                            request: true,
                                            duplicate: true,
                                          });
                                          send_request_make_friend_by_me(
                                            props?.member?.filter(
                                              (item) =>
                                                item?._id !== localStorage.getItem("uid")
                                            )?.[0]?._id,
                                            setData2
                                          );
                                        }}
                                        variant={"primary"}
                                      >
                                        {<>Kết bạn</>}
                                      </Button>
                                      <Button
                                        disabled={
                                          data2?.duplicate === true
                                            ? true
                                            : false
                                        }
                                        onClick={() => {
                                          setToggleMakeFriend(() => false);
                                        }}
                                        variant={"secondary"}
                                      >
                                        {<>Hủy</>}
                                      </Button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                      </>
                    )}
                </div>
              </>

              {/* host class */}
              {props?.label && (
                <>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {searchMember?.trim()?.length <= 0 && (
                      <Button
                        color={"primary"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setToAddMember(() => true);
                          setChange2((prev) => !prev);
                        }}
                      >
                        Thêm thành viên
                      </Button>
                    )}
                  </div>
                  <br />
                  {toAddMember === true && (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        // gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <TextField
                          fullWidth
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          type={"text"}
                          placeholder="Tìm kiếm tại đây"
                          style={{
                            height: 40,
                            borderRadius: 80,
                            outlineColor: "orange",
                            marginBottom: 12,
                          }}
                        ></TextField>
                        {isSearching === false && (
                          <Button
                            style={{ height: 56, marginTop: 5 }}
                            color={"primary"}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchMember("");
                              setToAddMember(false);
                            }}
                          >
                            Hủy
                          </Button>
                        )}
                      </div>
                      <br />
                      {/* {searchMember?.trim()?.length > 0 && 
                      <Button
                        style={{marginBottom: 12}}
                        onClick={(e) => {
                          e.stopPropagation();
                          search_user_by_phone(searchMember, setDataSearchMember);
                        }}
                        color={"primary"}
                      >
                        Tìm
                      </Button>
                    } */}
                      <div style={{ width: "100%" }}>
                        {isSearching === true && (
                          <div
                            id="infiniteScrollContainer"
                            style={{ maxHeight: 300, overflow: "auto" }}
                          >
                            {linearSearchByPhoneNumberAndUsername(
                              dataSearch,
                              search
                            )?.length > 0 &&
                              linearSearchByPhoneNumberAndUsername(
                                dataSearch,
                                search
                              ).map((item, index) => (
                                <ListFriendComponent
                                  is_member={props?.member?.some(item2=> item2._id === item?._id)}
                                  is_add_member={true}
                                  key={index}
                                  setResultAddMember={setResultAddMember}
                                  setChange={props?.setChange}
                                  
                                  {...item}
                                />
                              ))}
                            {linearSearchByPhoneNumberAndUsername(
                              dataSearch,
                              search
                            )?.length <= 0 && (
                              <div style={{ margin: 12, textAlign: "center" }}>
                                Không tìm thấy kết quả phù hợp
                              </div>
                            )}
                            {/* {
          data?.map((item, key)=> <ListFriendComponent setArrayMember={props?.setArrayMember} arrayMember={props?.arrayMember} is_invite={props?.is_invite} key={key} {...item} />)
        } */}
                          </div>
                        )}
                      </div>

                      {dataSearchMember?.exist === true && (
                        <Fragment>
                          <CoverPhoto
                            coverPhoto={dataSearchMember?.coverPhoto}
                          />
                          <Avatar avatar={dataSearchMember?.profilePicture} />
                          <NameProfile username={dataSearchMember?.username} />
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 16,
                            }}
                          >
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                add_member_to_group(
                                  props?.id_conversation,
                                  dataSearchMember?._id,
                                  setResultAddMember
                                );
                              }}
                              variant="primary"
                            >
                              Thêm thành viên
                            </Button>
                          </div>
                          <ProfileInfo user={dataSearchMember} />
                          <br />
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "row-reverse",
                              alignItems: "center",
                              gap: 16,
                            }}
                          >
                            <Button onClick={() => {}} variant="primary">
                              Thêm
                            </Button>
                          </div>
                        </Fragment>
                      )}
                    </div>
                  )}
                </>
              )}
              {props?.label && (
                <div style={{ width: "100%" }}>
                  <div
                    style={{ fontWeight: 600, marginBottom: 8, width: "100%" }}
                  >
                    Trưởng nhóm
                  </div>
                  <div
                    style={{ width: "100%", maxHeight: 200, overflow: "auto" }}
                  >
                    {_.unionBy(props?.member, function (e) {
                      return e?._id;
                    })
                      ?.filter((item) => item?._id === props?.createdBy)
                      ?.map((item, key) => (
                        <ListMember
                          setResult={props?.setChange}
                          id_conversation={props?.id_conversation}
                          my_id={localStorage.getItem("uid")}
                          createdBy={props?.createdBy}
                          is_group={true}
                          isHostGroup={isHostGroup}
                          key={item?._id || key}
                          {...item}
                        ></ListMember>
                      ))}
                  </div>
                </div>
              )}
              {/* member in class include me */}
              {props?.label && (
                <div style={{ width: "100%" }}>
                  <div
                    style={{ fontWeight: 600, marginBottom: 8, width: "100%" }}
                  >
                    Thành viên nhóm
                  </div>
                  <div
                    style={{ width: "100%", maxHeight: 200, overflow: "auto" }}
                  >
                    {_.unionBy(props?.member, function (e) {
                      return e?._id;
                    })?.filter((item) => item?._id !== props?.createdBy)
                      ?.length > 0 &&
                      _.unionBy(props?.member, function (e) {
                        return e?._id;
                      })
                        ?.filter((item) => item?._id !== props?.createdBy)
                        ?.map((item, key) => (
                          <ListMember
                            setResult={props?.setChange}
                            id_conversation={props?.id_conversation}
                            my_id={localStorage.getItem("uid")}
                            is_group={true}
                            isHostGroup={isHostGroup}
                            key={item?._id || key}
                            {...item}
                          ></ListMember>
                        ))}
                    {_.unionBy(props?.member, function (e) {
                      return e?._id;
                    })?.filter((item) => item?._id !== props?.createdBy)
                      ?.length <= 0 && (
                      <div style={{ margin: 12, textAlign: "center" }}>
                        Không có thành viên nào
                      </div>
                    )}
                  </div>
                </div>
              )}
              {props?.label && isHostGroup === false && (
                <>
                  <br />
                  <div
                    className={"fjkladjkljdkldas"}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      onClick={() =>
                        out_group(props?.id_conversation, setChange)
                      }
                      color={"primary"}
                    >
                      Rời nhóm
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};

const ListMember = (props) => {
  return <ListFriendComponent {...props} />;
};
