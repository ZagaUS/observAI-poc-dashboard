const WS_URL = process.env.REACT_APP_APIURL_ALERT_WS;

export const getRealtimeAlertData = () => {
    try {
        const socket = new WebSocket(`${WS_URL}`);
        return socket;
    } catch (error) {
        console.error("Error connecting socket", error);
        throw error;
    }
}