using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class FirstPersonPlayer : MonoBehaviour
{
    public static FirstPersonPlayer player;
    
    public float mouseSensitivity = 200f;
    public float moveSpeed = 24f;
    public Transform playerBody;
    public CharacterController controller;

    private float xRotation = 0f;
    private bool flying;
    
    void Start()
    {
        Cursor.lockState = CursorLockMode.Locked;
        flying = false;
        player = this;
    }

    
    void Update()
    {
        float mouseX = Input.GetAxisRaw("Mouse X") * mouseSensitivity * Time.deltaTime;
        float mouseY = Input.GetAxisRaw("Mouse Y") * mouseSensitivity * Time.deltaTime;

        xRotation -= mouseY;
        xRotation = Mathf.Clamp(xRotation, -90f, 90f);
        
        transform.localRotation = Quaternion.Euler(xRotation, 0f, 0f);
        playerBody.Rotate(Vector3.up * mouseX);
        
        if(Player.controllable)
            Movement();
        
        //Make mouse visible for buttons
        RaycastHit hit;
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);

        if (Physics.Raycast(ray, out hit)) {
            if (hit.transform.CompareTag("MouseVisible")) {
                Cursor.lockState = CursorLockMode.Confined;
                Cursor.visible = true;
            }
            else if (Player.controllable) {
                Cursor.lockState = CursorLockMode.Locked;
                Cursor.visible = false;
            }
        }
    }

    void Movement()
    {
        float x = Input.GetAxis("Horizontal");
        float z = Input.GetAxis("Vertical");

        Vector3 move = playerBody.right * x + playerBody.forward * z;

        if (playerBody.position.y < 8.2f && !flying)
            move.y += -9.81f * Time.deltaTime * moveSpeed;

        controller.Move(move * (moveSpeed * Time.deltaTime));

        Vector3 velocity = new Vector3();
        if (Input.GetKey(KeyCode.Space)) {
            velocity.y += 10f * Time.deltaTime;
            flying = true;
        }
        else if (Input.GetKey(KeyCode.C)) {
            velocity.y -= 10f * Time.deltaTime;
            flying = true;
        }
        else {
            flying = false;
        }

        controller.Move(velocity);

    }
}
