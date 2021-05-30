#include <WiFi.h>
#include <PubSubClient.h>


const char* ssid = "A8+";
const char* password = "gum089072484";
const char* mqtt_server = "broker.netpie.io";
const int mqtt_port = 1883;
const char* mqtt_Client = "46ccb5f9-2b18-4b1c-836e-7f0976c4d748";
const char* mqtt_username = "Wd8QahSjWL8rg3bWXoeSvATZA3MhNf3x";
const char* mqtt_password = "RKRAgOQUktN6ss0HP2kWqw81UpJWG*F9";

WiFiClient espClient;
PubSubClient client(espClient);

long lastMsg = 0;
long lastSend = 0;
int value = 0;

HardwareSerial uart(2);


void reconnect() {
    while (!client.connected()) {
      Serial.print("Attempting MQTT connection…");
      if (client.connect(mqtt_Client, mqtt_username, mqtt_password)) {
        Serial.println("connected");
        client.subscribe("@msg/led");
        client.subscribe("@msg/floor");
      }
      else {
        Serial.print("failed, rc=");
        Serial.print(client.state());
        Serial.println("try again in 5 seconds");
        delay(5000);
      }
    }
  }

void callback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Length = ");
    Serial.println(length);
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    String message;
    for (int i = 0; i < length; i++) {
        message = message + (char)payload[i];
    }
    Serial.println(message);
/*    
//    if(String(topic) == "@msg/led") {
//      if(message == "on"){
//        Serial.println("led on");
//        client.publish("@shadow/data/update","{\"data\": {\"led\": true}}");
//      } else if(message == "off"){
//        Serial.println("led off");
//        client.publish("@shadow/data/update","{\"data\": {\"led\": false}}");
//      }
//      Serial.println("data in");
    } else */if(String(topic) == "@msg/floor"){
      Serial.println("data in");
      Serial.println(message);
      while(1){
        if(uart.available()){
          String receivedData = uart.readString();
          Serial.println(receivedData);
          Serial.println("receive");
          String data = "{\"data\": "+ receivedData + "}";
          client.publish("@shadow/data/update", data.c_str());
          break;
        } else{
          uart.write(message.c_str());
          delay(10);
        }
      }
    }
}
  
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  uart.begin(115200,SERIAL_8N1,16,17);
  uart.setTimeout(100);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}



void loop() {
  // put your main code here, to run repeatedly:
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    ++value;
    client.publish("@msg/test", "Hello NETPIE2020");
    Serial.println("Hello NETPIE2020");
    
  }

//  if (now - lastSend > 200){
//    lastSend = now;
//    char test_str[2];
//    sprintf(test_str,"1");
//    Serial.println("send");
//    //Serial.println(uart.write(test_str)); 
//  }
  
  if(uart.available()){
    String receivedData = uart.readString();
    Serial.println(receivedData);
    Serial.println("receive");
    String data = "{\"data\": "+ receivedData + "}";
    client.publish("@shadow/data/update", data.c_str());
  }
  
  
  delay(1);
}
