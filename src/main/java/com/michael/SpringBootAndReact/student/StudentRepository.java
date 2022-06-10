package com.michael.SpringBootAndReact.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student,Long> {

    List<Student> findByEmail(String email);

    @Query("" +
    "SELECT CASE WHEN COUNT(s) > 0 THEN " +
    "TRUE ELSE FALSE END " +
    "FROM Student s "+
    "WHERE s.email = ?1"
    )
    Boolean selectExistsEmail(String email);
}
