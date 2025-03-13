import { useState } from "react";
import { Input, Button, Textarea, Divider } from "shineout";
import axios from "axios";

import "./App.css";

function App() {
  const [passwordInput, setPasswordInput] = useState("");
  const [showGenerateToken, setShowGenerateToken] = useState(false);
  const [signature, setSignature] = useState("");

  const handleRequestToken = async () => {
    try {
      const config = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${import.meta.env.VITE_WEBHOOK_PASSWORD}`,
        },
        data: {
          token: import.meta.env.VITE_WEBHOOK_TOKEN,
        },
        url: `${import.meta.env.VITE_API_URL}/api/generate-signature`,
      };
      const { data } = await axios(config);
      setSignature(data?.signature);
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
          const actualPassword = import.meta.env.VITE_WEBHOOK_PASSWORD;
          if (passwordInput === actualPassword) {
            setShowGenerateToken(true);
            handleRequestToken();
          } else {
            alert("Incorrect password");
          }
        }}
      >
        <div>
          <Input.Password
            placeTitle='Password'
            placeholder='Password'
            onChange={(e) => setPasswordInput(e)}
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
            <Textarea
              rows={3}
              value={`${import.meta.env.VITE_WEBHOOK_URL_PREFIX}/webhook/${
                import.meta.env.VITE_WEBHOOK_TOKEN
              }/${signature}`}
              size='large'
              readOnly
              width={500}
            />
          )}
          <div style={{ marginTop: 10 }}>
            <Button
              type='success'
              onClick={() => {
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_WEBHOOK_URL_PREFIX}/webhook/${
                    import.meta.env.VITE_WEBHOOK_TOKEN
                  }/${signature}`
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
