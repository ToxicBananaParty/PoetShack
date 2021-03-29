using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using MySql.Data.MySqlClient;

public class DatabaseManager : MonoBehaviour
{
	public static MySqlConnection conn;
	private static MySqlCommand dbService;
    
    void Start()
    {
	    conn = new MySqlConnection("server=ls-5c28972521bc3fbc12e3aa4099765206229cc6e2.cqbldgemyejd.us-east-1.rds.amazonaws.com;" 
	                               + "uid=dbmasteruser;pwd=temppass;database=poetshack;CharSet=utf8");
	    conn.Open();
        dbService = new MySqlCommand();
        dbService.Connection = conn;
    }

    public static void ExecuteQuery(string query) {
	    if (dbService.Connection == null || dbService == null)
		    return;

	    //query = MySqlHelper.EscapeString(query);
	    dbService.CommandText = query;
	    dbService.ExecuteNonQuery();
    }
}
