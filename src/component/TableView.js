import React, { useEffect, useState } from 'react';
import HttpService from '../apiClient/HttpService';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const TableView = (props) => {

    const [data, setData] = useState(null);
    const [xdata, setXdata] = useState(null);
    const [user, setUser] = useState(null);

    // const ws = new WebSocket("wss://ws.bitstamp.net");

    // const apiCall = {
    //     event: "bts:subscribe",
    //     data: { channel: "order_book_btcusd" },
    //     };

    // ws.onopen = (event) => {
    //     ws.send(JSON.stringify(apiCall));
    //     };

    // ws.onmessage = function (event) {
    //     const json = JSON.parse(event.data);
    //     console.log(`[message] Data received from server: ${json}`);
    //     try {
    //     if ((json.event = "data")) {
        
    //             console.log(json.data);
    //           }
    //         } catch (err) {
    //           // whatever you wish to do with the err
    //         }
        
    //     };

    useEffect(() => {
        // console.log("Hello World! - From useEffect()");
        const socket = new SockJS("http://127.0.0.1:8888/demo-web-socket-app");
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, function(frame) {
            console.log("Connected: " + frame);
            // stompClient.subscribe('/topic/info-replies-1', function(frame) {
            //     console.log("Received: " + frame);
            //     setData(frame.body);
            // });
            // stompClient.subscribe('/topic/info-replies-2', function(frame) {
            //     console.log("Received: " + frame);
            //     setXdata(frame.body);
            // });

            var url = stompClient.ws._transport.url;
            console.log("RAW url is : " + url);
            url = url.replace("ws://127.0.0.1:8888/demo-web-socket-app/",  "");
            url = url.replace("/websocket", "");
            url = url.replace(/^[0-9]+\//, "");
            console.log("Your current session is: " + url);
            setUser(url);
            var dynamicTopic = "/user/queue/specific-user" + "-user" + url;
            console.log("Dynamic Topic: " + dynamicTopic)
            stompClient.subscribe(dynamicTopic, function (frame) {
                console.log("Received Personal: " + frame);
                setData(frame.body);

            });

            // stompClient.send("/app/info", {}, "Hello from react");
            stompClient.send("/app/personal", {}, "Hello");
        });
    }, []);

    const fetchData = () => {
        console.log("Fetching data...");
        HttpService.get("http://127.0.0.1:8888/common/info").then((response) => {
            console.log(response);
            setData(response.data);
        })
    }

    // fetchData();

    return (
        <div>
            <h3>User: {user}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John</td>
                        <td>{data}</td>
                    </tr>
                    <tr>
                        <td>Max</td>
                        <td>{xdata}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TableView;