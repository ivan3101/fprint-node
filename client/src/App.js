import React, { Component } from 'react';
import "./App.css";
import QrReader from "react-qr-reader";

class App extends Component {
    state = {
        delay: 3000,
        qr: true,
        status: null,
        message: null
    };

    handleScan = async (data) => {
        if (data) {
            this.setState(() => ({
                qr: false
            }));

            this.setState(() => ({
                status: null,
                message: "Por favor deslice su dedo por el lector para verificar su huella"
            }));

            const cedula = data.split(' ')[2];
            try {
                const rawResponse = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cedula: cedula })
                });
                const response = await rawResponse.json();

                this.setState(() => ({
                    status: response.status,
                    message: response.message,
                    qr: response.status === 'Error'
                }));

            } catch (e) {
                this.setState(() => ({
                    status: 'Error',
                    message: 'Ocurrio un error al leer su huella',
                    qr: true
                }))
            }
        }
    };

    handleError = (err) => {
        console.log(err);
    };

    render() {
        return (
            <div className="App">
                <div>
                    {this.state.status && <h5>{this.state.status}</h5>}
                    {this.state.message && <p>{this.state.message}</p>}
                </div>
                {
                    this.state.qr && <QrReader
                        delay={this.state.delay}
                        onError={this.handleError}
                        onScan={this.handleScan}
                        style={{ width: '400px' }}
                    />
                }
            </div>
        );
    }
}

export default App;
