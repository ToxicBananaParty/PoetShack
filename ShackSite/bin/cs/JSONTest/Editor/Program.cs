using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace Editor
{
    static class Program
    {
        static void Main(string[] args)
        {
            Manager instance = new Manager();
        }
    }

    class Manager
    {
        private readonly string outputFile = "..//data//data.json";
        private string dataLocation, sentimentLocation, urgencyLocation;

        public Manager()
        {
            FindFiles();
            JsonSerializer serializer = new JsonSerializer(); //(De)serializes JSON, a la JSON.parse() and JSON.stringify()
            TextReader fileReader = new StreamReader(dataLocation); //C# class to read file text
            JsonReader reader = new JsonTextReader(fileReader); //Newtonsoft class to read JSON from files
            reader.SupportMultipleContent = true;
            
			//Basically JSON.parse() but with static typing. "reader" arg is the poem.js JSON
            ReadPoem scannedPoem = serializer.Deserialize<ReadPoem>(reader);
            
            if (scannedPoem != null) //If the JSON serializer correctly converts the input JSON to a ReadPoem obj
            {
                //Now read the sentiment file and add that data to the ReadPoem
                fileReader = new StreamReader(sentimentLocation);
                reader = new JsonTextReader(fileReader);
                scannedPoem.sentiment = serializer.Deserialize<NeuralNet>(reader);
                
                //Now read the urgency file and add that data to the ReadPoem
                fileReader = new StreamReader(urgencyLocation);
                reader = new JsonTextReader(fileReader);
                scannedPoem.urgency = serializer.Deserialize<NeuralNet>(reader);

                //Now make a new Poem that has the data of the ReadPoem
                Poem poem = new Poem(scannedPoem);
                SavePoem(poem); //Write poem to file
            }

            Environment.Exit(0);
        }

        private void SavePoem(Poem poem)
        {
            //JsonConvert.SerializeObject returns a string (in JSON) of an object, similar to JSON.stringify
            //Then write that string to outputFile
            File.WriteAllText(outputFile, JsonConvert.SerializeObject(poem, Formatting.Indented));
        }

        private void FindFiles()
        {
            //For now, just hardcoded values
            //Have it navigate file structure when we've got that finalized on the server
            dataLocation = "..//data//poem.json";
            sentimentLocation = "..//data//sentiment.json";
            urgencyLocation = "..//data//urgency.json";
        }
    }

    class ReadPoem
    {
        //JSONProperty(string) tells the JSONSerializer which property in JSON corresponds to which variable in this object
        [JsonProperty("poem")]public string poem;
        [JsonProperty("author")]public string author;
        [JsonProperty("syllables")]public List<string> syllables;
        [JsonProperty("midiArray")]public List<Midi> midis;
        
        //These do not have JSONProperties because they are not given data when the object is deserialized,
        //instead they are deserialized separately and then manually assigned (see lines 34-42)
        public NeuralNet sentiment;
        public NeuralNet urgency;

        public ReadPoem()
        {
            
        }
    }

    class Poem
    {
        [JsonProperty("poem")]public string poem;
        [JsonProperty("author")]public string author;
        [JsonProperty("syllables")] public List<string> syllables;
        [JsonProperty("midis")]public List<Midi> midis;
        [JsonProperty("sentiment")]public NeuralNet sentiment;
        [JsonProperty("urgency")]public NeuralNet urgency;
        [JsonProperty("color")]public int[] colorArray;
        [JsonProperty("effect")]public Effect effect;
        [JsonProperty("effectSpeed")]public double effectDuration;
        [JsonProperty("effectScale")]public double effectScale;
        
        public Poem(ReadPoem old)
        {
            //Add all the data that we're tracking from the scanned object
            poem = old.poem;
            author = old.author;
            syllables = old.syllables;
            midis = old.midis;
            sentiment = old.sentiment;
            urgency = old.urgency;
            
            //Assign values to the not-scanned properties for now
            //Eventually these will all be done programatically based on the scanned data
            colorArray = new int[3];
            effect = Effect.Empty;
            effectDuration = 2.0;
            effectScale = 1.0;
        }

        public int[] CalculateColor()
        {
            int[] colors = new int[3];
            Random random = new Random();

            if (sentiment.result.ToLower() == "positive")
            {
                if (urgency.result.ToLower() == "urgent") //Happy and Urgent
                {
                    for (int i = 0; i < 3; i++)
                    {
                        colors[i] = random.Next(192, 255);
                    }
                }
                else //Happy and Not Urgent
                {
                    for (int i = 0; i < 3; i++)
                    {
                        colors[i] = random.Next(128, 191);
                    }
                }
            }
            else
            {
                if (urgency.result.ToLower() == "urgent") //Unhappy and Urgent
                {
                    for (int i = 0; i < 3; i++)
                    {
                        colors[i] = random.Next(64, 127);
                    }
                }
                else //Unhappy and Not Urgent
                {
                    for (int i = 0; i < 3; i++)
                    {
                        colors[i] = random.Next(0, 63);
                    }
                }
            }
            
            return colors;
        }
    }
}