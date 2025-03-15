import { useState, useEffect } from "react";
import { Input, Button, Divider } from "antd";
import axios from "axios";

import "./App.css";

const { TextArea } = Input;
function App() {
  const [passwordInput, setPasswordInput] = useState("");
  const [showGenerateToken, setShowGenerateToken] = useState(false);
  const [signature, setSignature] = useState("");
  const [siteInfo, setSiteInfo] = useState({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/info`)
      .then((res) => {
        const data = res.data;
        setSiteInfo(data);
      })
      .catch((error) => {
        console.error(error);
      });
    return () => {};
  }, []);

  const handleRequestToken = async () => {
    try {
      const config = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${passwordInput}`,
        },
        data: {
          token: siteInfo?.token,
        },
        url: `${import.meta.env.VITE_API_URL}/generate-signature`,
      };
      const { data } = await axios(config);
      setSignature(data?.signature);
      setShowGenerateToken(true);
    } catch (error) {
      alert(
        `Error On Generating Token: ${
          error?.response?.data?.error || error?.message
        }`
      );
    }
  };

  return (
    <div>
      <h2>IAEC/PSUIE Webhook Server</h2>
      <p>
        Webhook Server for Internal Used For IAEC and PSUIE Projects Only,{" "}
        <br />
        Password can be asked from the administrator. <br />
        For another purpose please use the public webhook platform.
      </p>
      <p style={{ marginTop: 20 }}>Enter Password to request token</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRequestToken();
        }}
      >
        <div>
          <Input.Password
            placeTitle='Password'
            placeholder='Password'
            onChange={(e) => setPasswordInput(e.target.value)}
            value={passwordInput}
            size='large'
            width={400}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <Button htmlType='submit' type='primary'>
            Generate Webhook URL
          </Button>
        </div>
      </form>

      {showGenerateToken && (
        <div style={{ marginTop: 40 }}>
          <h4>Generate Webhook Signature and URL Success</h4>
          {signature && (
            <TextArea
              rows={3}
              value={`${siteInfo?.urlPrefix}/webhook/${siteInfo?.token}/${signature}`}
              size='large'
              readOnly
              width={500}
            />
          )}
          <div style={{ marginTop: 10 }}>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${siteInfo?.urlPrefix}/webhook/${siteInfo?.token}/${signature}`
                );
                alert("Copied to clipboard");
              }}
            >
              Copy
            </Button>
          </div>
        </div>
      )}

      <Divider style={{ marginTop: 50 }}>
        &copy; 2025 Intelligent Automation Engineering Center
      </Divider>
      <div>
        Joint Developed by IAEC,TDC, and PSU-IE using Vite 6.2 and React 19.0{" "}
      </div>
      <div>Hosted Paid By PSU Innovative Engineering Co.,ltd.</div>
    </div>
  );
}

export default App;
