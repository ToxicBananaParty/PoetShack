using System;
using System.Collections;
using System.Collections.Generic;
using System.Numerics;
using UnityEngine;
using UnityEngine.SceneManagement;
using Quaternion = UnityEngine.Quaternion;
using Vector3 = UnityEngine.Vector3;

public class Player : MonoBehaviour {
    public static Player player;
    public static bool controllable;

    public bool thirdPerson;
    
    private Rigidbody myRigidbody;
    private float flySpeed;
    private float turnSmoothSpeed;
    void Start() {
        player = this;
        flySpeed = 0.0f;
        controllable = true;
        thirdPerson = false;
    }
    
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
            Application.Quit(0);
    }

    public void SetControllable(bool toSet) {
        controllable = toSet;
    }

    private void OnControllerColliderHit(ControllerColliderHit hit)
    {
        if (hit.gameObject.CompareTag("Portal")) {
            if (SceneManager.GetActiveScene().buildIndex == 1)
                SceneManager.LoadScene(0);
            else
                SceneManager.LoadScene(1);
        }
    }
}
