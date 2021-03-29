using System;
using System.Collections;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Video;

public class GameManager : MonoBehaviour {
    public static GameManager instance;

    public GameObject poemInputUI;
    public InputField authorField;
    public TMP_InputField poemField;
    public Text poemOutputText;

    private float timer;
    private int id;
    void Start() {
        instance = this;
        timer = 0.0f;
        id = 1;
    }

    void Update()
    {
    }

    public void ToggleSubmit() {
        bool toSet = !poemInputUI.activeInHierarchy;
        poemInputUI.SetActive(toSet);
        Player.player.SetControllable(!toSet);
    }

    public void SubmitPoem(Dropdown effectField) {
        foreach (VideoPlayer effectVid in PoemDisplayManager.effects) {
            effectVid.Stop();
        }
        string poem = poemOutputText.text = poemField.text;
        string author = authorField.text;
        string json = "Havent done Unity json yet"; //TODO: Feed into json analyzer
        int effect = effectField.value;

        //poem = MySqlHelper.EscapeString(poem);
        //author = MySqlHelper.EscapeString(author);

        DatabaseManager.ExecuteQuery("INSERT INTO poems (poem, author, json, gif) VALUES ('" + poem + "', '" + author + "', '" + json + "', '" + effect + "')");
        

        ToggleSubmit();
        PoemDisplayManager.effects[effect].Play();

        PoemDisplayManager.displayPlane.enabled = true;
    }
}
