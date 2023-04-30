/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author faiqi_jriqk2d
 */
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.RestAssured;

import static io.restassured.RestAssured.given;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import io.restassured.response.Response;
import static org.hamcrest.Matchers.*;
import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.BeforeAll;

public class MetabaseAPITest {

    // Set up the base URL and API token for the Metabase API
    private static final String BASE_URL = "http://localhost:3000";
    private static final String API_TOKEN = "f667ba71-1ee9-4f88-93a0-26571401a281";

    @BeforeAll
    static void setUp() {
        // Set up the RestAssured client with the base URL and API token
        RestAssured.baseURI = BASE_URL;
        RestAssured.basePath = "/api/user";
    }

    @Test
    void testGetCurrentUser() throws JsonProcessingException {
        RestAssured.given().header("X-Metabase-Session", API_TOKEN)
                .accept("application/json")
                .when()
                .get("http://localhost:3000/api/user/current")
                .then()
                .assertThat()
                .body("email", equalTo("faiqijaz43@gmail.com"))
                .log().all();

        System.out.println("Test passed");
    }

    @Test
    void testGetBookMarkForUser() {
        RestAssured.given().header("X-Metabase-Session", API_TOKEN)
                .accept("application/json")
                .when()
                .get("http://localhost:3000/api/bookmark")
                .then()
                .assertThat()
                .log().all();

        System.out.println("Test passed");
    }

    @Test
    void testGetLoginHistoryOfUser() {
        RestAssured.given().header("X-Metabase-Session", API_TOKEN)
                .accept("application/json")
                .when()
                .get("http://localhost:3000/api/login-history/current")
                .then()
                .assertThat()
                .log().all();

        System.out.println("Test passed");
    }

    @Test
    void testGetTimeLineOfUser() {
        RestAssured.given().header("X-Metabase-Session", API_TOKEN)
                .accept("application/json")
                .when()
                .get("http://localhost:3000/api/timeline/")
                .then()
                .assertThat()
                .log().all();

        System.out.println("Test passed");
    }
    
    @Test
    void testGetSettingsOfUser() {
        RestAssured.given().header("X-Metabase-Session", API_TOKEN)
                .accept("application/json")
                .when()
                .get("http://localhost:3000/api/setting/")
                .then()
                .assertThat()
                .log().all();

        System.out.println("Test passed");
    }
}
