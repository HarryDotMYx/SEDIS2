import initSqlJs from 'sql.js';

let db: any = null;
let SQL: any = null;

export async function initDB() {
  if (db) return db;
  
  try {
    SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    
    db = new SQL.Database();
    
    // Create tables
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        avatar_url TEXT,
        notifications_enabled BOOLEAN DEFAULT true,
        theme TEXT DEFAULT 'light',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS entrepreneurs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ic_number TEXT NOT NULL,
        gender TEXT NOT NULL,
        race TEXT NOT NULL,
        academic TEXT NOT NULL,
        phone TEXT NOT NULL,
        company_name TEXT NOT NULL,
        address TEXT NOT NULL,
        email TEXT NOT NULL,
        district TEXT NOT NULL,
        business_type TEXT NOT NULL,
        business_field TEXT NOT NULL,
        agency TEXT NOT NULL,
        employee_count INTEGER NOT NULL,
        program TEXT NOT NULL,
        premise_lot TEXT NOT NULL,
        location TEXT NOT NULL,
        monthly_income DECIMAL(10,2) NOT NULL,
        business_status TEXT NOT NULL,
        year INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Add default admin user if none exists
      INSERT OR IGNORE INTO users (email, password, name, role)
      VALUES ('admin@sedco.gov.my', 'admin123', 'Admin User', 'admin');

      -- Add sample entrepreneurs if none exist
      INSERT OR IGNORE INTO entrepreneurs (
        name, ic_number, gender, race, academic, phone, company_name, 
        address, email, district, business_type, business_field, agency,
        employee_count, program, premise_lot, location, monthly_income,
        business_status, year
      )
      SELECT 
        'Sarah Abdullah', '890514-12-5442', 'female', 'Melayu', 'Diploma',
        '0123456789', 'Sabah Craft Enterprise', 'Jalan Pantai, KK',
        'sarah@example.com', 'kota-kinabalu', 'product', 'Kraftangan',
        'MIDE', 3, 'rental', 'A-12', 'KK City Mall', 5000.00, 'active', 2024
      WHERE NOT EXISTS (SELECT 1 FROM entrepreneurs LIMIT 1);
    `);

    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export async function authenticateUser(email: string, password: string) {
  await initDB();
  
  try {
    const result = db.exec(`
      SELECT id, email, name, role 
      FROM users 
      WHERE email = '${email}' AND password = '${password}'
      LIMIT 1
    `);
    
    if (result.length > 0 && result[0].values.length > 0) {
      const [id, email, name, role] = result[0].values[0];
      return { id, email, name, role };
    }
    
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function getDashboardStats() {
  await initDB();
  
  try {
    const stats = {
      totalEntrepreneurs: 0,
      activeBusinesses: 0,
      averageIncome: 0,
      totalEmployees: 0
    };

    // Total entrepreneurs
    const totalResult = db.exec("SELECT COUNT(*) FROM entrepreneurs")[0];
    stats.totalEntrepreneurs = totalResult.values[0][0];

    // Active businesses
    const activeResult = db.exec(
      "SELECT COUNT(*) FROM entrepreneurs WHERE business_status = 'active'"
    )[0];
    stats.activeBusinesses = activeResult.values[0][0];

    // Average monthly income
    const incomeResult = db.exec(
      "SELECT AVG(monthly_income) FROM entrepreneurs"
    )[0];
    stats.averageIncome = Math.round(incomeResult.values[0][0] || 0);

    // Total employees
    const employeesResult = db.exec(
      "SELECT SUM(employee_count) FROM entrepreneurs"
    )[0];
    stats.totalEmployees = employeesResult.values[0][0] || 0;

    return stats;
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return null;
  }
}

export async function getRecentActivities() {
  await initDB();
  
  try {
    const result = db.exec(`
      SELECT 
        a.description,
        a.created_at,
        u.name as user_name
      FROM activities a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `);

    if (!result[0]) return [];

    return result[0].values.map((row: any[]) => ({
      description: row[0],
      time: new Date(row[1]).toLocaleString(),
      user: row[2]
    }));
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return [];
  }
}

export async function getAllEntrepreneurs() {
  await initDB();
  
  try {
    const result = db.exec(`
      SELECT 
        id,
        name,
        ic_number,
        company_name,
        business_type,
        business_status,
        district
      FROM entrepreneurs
      ORDER BY name ASC
    `);

    if (!result[0]) return [];

    return result[0].values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      icNumber: row[2],
      companyName: row[3],
      businessType: row[4],
      status: row[5],
      district: row[6]
    }));
  } catch (error) {
    console.error('Error getting entrepreneurs:', error);
    return [];
  }
}

export async function getEntrepreneurById(id: number) {
  await initDB();
  
  try {
    const result = db.exec(`
      SELECT 
        name,
        ic_number,
        gender,
        race,
        academic,
        phone,
        company_name,
        address,
        email,
        district,
        business_type,
        business_field,
        agency,
        employee_count,
        program,
        premise_lot,
        location,
        monthly_income,
        business_status,
        year
      FROM entrepreneurs
      WHERE id = ${id}
      LIMIT 1
    `);

    if (!result[0] || !result[0].values.length) return null;

    const row = result[0].values[0];
    return {
      name: row[0],
      icNumber: row[1],
      gender: row[2],
      race: row[3],
      academic: row[4],
      phone: row[5],
      companyName: row[6],
      address: row[7],
      email: row[8],
      district: row[9],
      businessType: row[10],
      businessField: row[11],
      agency: row[12],
      employeeCount: row[13],
      program: row[14],
      premiseLot: row[15],
      location: row[16],
      monthlyIncome: row[17],
      businessStatus: row[18],
      year: row[19]
    };
  } catch (error) {
    console.error('Error getting entrepreneur details:', error);
    return null;
  }
}

export async function addEntrepreneur(data: any) {
  await initDB();
  
  try {
    db.run(`
      INSERT INTO entrepreneurs (
        name, ic_number, gender, race, academic, phone, company_name,
        address, email, district, business_type, business_field, agency,
        employee_count, program, premise_lot, location, monthly_income,
        business_status, year
      ) VALUES (
        '${data.name}', '${data.icNumber}', '${data.gender}', '${data.race}',
        '${data.academic}', '${data.phone}', '${data.companyName}',
        '${data.address}', '${data.email}', '${data.district}',
        '${data.businessType}', '${data.businessField}', '${data.agency}',
        ${data.employeeCount}, '${data.program}', '${data.premiseLot}',
        '${data.location}', ${data.monthlyIncome}, '${data.businessStatus}',
        ${data.year}
      )
    `);

    return true;
  } catch (error) {
    console.error('Error adding entrepreneur:', error);
    return false;
  }
}

export async function updateEntrepreneur(id: number, data: any) {
  await initDB();
  
  try {
    db.run(`
      UPDATE entrepreneurs
      SET
        name = '${data.name}',
        ic_number = '${data.icNumber}',
        gender = '${data.gender}',
        race = '${data.race}',
        academic = '${data.academic}',
        phone = '${data.phone}',
        company_name = '${data.companyName}',
        address = '${data.address}',
        email = '${data.email}',
        district = '${data.district}',
        business_type = '${data.businessType}',
        business_field = '${data.businessField}',
        agency = '${data.agency}',
        employee_count = ${data.employeeCount},
        program = '${data.program}',
        premise_lot = '${data.premiseLot}',
        location = '${data.location}',
        monthly_income = ${data.monthlyIncome},
        business_status = '${data.businessStatus}',
        year = ${data.year},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `);

    return true;
  } catch (error) {
    console.error('Error updating entrepreneur:', error);
    return false;
  }
}

export async function deleteEntrepreneur(id: number) {
  await initDB();
  
  try {
    db.run(`DELETE FROM entrepreneurs WHERE id = ${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting entrepreneur:', error);
    return false;
  }
}

export async function getUserSettings(userId: number) {
  await initDB();
  
  try {
    const result = db.exec(`
      SELECT 
        name,
        email,
        role,
        avatar_url,
        notifications_enabled,
        theme,
        created_at,
        updated_at
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `);

    if (!result[0] || !result[0].values.length) return null;

    const row = result[0].values[0];
    return {
      name: row[0],
      email: row[1],
      role: row[2],
      avatarUrl: row[3],
      notificationsEnabled: Boolean(row[4]),
      theme: row[5],
      createdAt: row[6],
      updatedAt: row[7]
    };
  } catch (error) {
    console.error('Error getting user settings:', error);
    return null;
  }
}

export async function updateUserProfile(userId: number, data: any) {
  await initDB();
  
  try {
    const updates = [];
    if (data.name) updates.push(`name = '${data.name}'`);
    if (data.email) updates.push(`email = '${data.email}'`);
    if (data.avatar_url) updates.push(`avatar_url = '${data.avatar_url}'`);
    if (typeof data.notifications_enabled !== 'undefined') {
      updates.push(`notifications_enabled = ${data.notifications_enabled ? 1 : 0}`);
    }
    if (data.theme) updates.push(`theme = '${data.theme}'`);
    
    if (updates.length === 0) return true;

    db.run(`
      UPDATE users
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `);

    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

export async function updateUserPassword(userId: number, currentPassword: string, newPassword: string) {
  await initDB();
  
  try {
    // Verify current password
    const result = db.exec(`
      SELECT id FROM users 
      WHERE id = ${userId} AND password = '${currentPassword}'
      LIMIT 1
    `);

    if (!result[0] || !result[0].values.length) {
      return {
        success: false,
        message: 'Current password is incorrect'
      };
    }

    // Update password
    db.run(`
      UPDATE users
      SET password = '${newPassword}', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `);

    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error) {
    console.error('Error updating password:', error);
    return {
      success: false,
      message: 'Failed to update password'
    };
  }
}

export async function getReportData(year: string) {
  await initDB();
  
  try {
    const data = {
      genderDistribution: [],
      raceDistribution: [],
      monthlyIncomeRanges: [],
      agencyDistribution: [],
      academicDistribution: [],
      programDistribution: [],
      businessTypeDistribution: [],
      districtDistribution: []
    };

    // Gender distribution
    const genderResult = db.exec(`
      SELECT gender, COUNT(*) as count
      FROM entrepreneurs
      WHERE year = ${year}
      GROUP BY gender
    `)[0];
    
    if (genderResult) {
      data.genderDistribution = genderResult.values.map((row: any[]) => ({
        name: row[0].charAt(0).toUpperCase() + row[0].slice(1),
        value: row[1]
      }));
    }

    // Race distribution
    const raceResult = db.exec(`
      SELECT race, COUNT(*) as count
      FROM entrepreneurs
      WHERE year = ${year}
      GROUP BY race
    `)[0];
    
    if (raceResult) {
      data.raceDistribution = raceResult.values.map((row: any[]) => ({
        name: row[0],
        value: row[1]
      }));
    }

    // Monthly income ranges
    const incomeResult = db.exec(`
      SELECT 
        CASE
          WHEN monthly_income < 2000 THEN 'Below RM2,000'
          WHEN monthly_income < 5000 THEN 'RM2,000 - RM4,999'
          WHEN monthly_income < 10000 THEN 'RM5,000 - RM9,999'
          ELSE 'RM10,000 and above'
        END as range,
        COUNT(*) as count
      FROM entrepreneurs
      WHERE year = ${year}
      GROUP BY range
      ORDER BY MIN(monthly_income)
    `)[0];
    
    if (incomeResult) {
      data.monthlyIncomeRanges = incomeResult.values.map((row: any[]) => ({
        range: row[0],
        count: row[1]
      }));
    }

    // Agency distribution
    const agencyResult = db.exec(`
      SELECT agency, COUNT(*) as count
      FROM entrepreneurs
      WHERE year = ${year}
      GROUP BY agency
    `)[0];
    
    if (agencyResult) {
      data.agencyDistribution = agencyResult.values.map((row: any[]) => ({
        name: row[0],
        value: row[1]
      }));
    }

    // Academic distribution
    const academicResult = db.exec(`
      SELECT academic, COUNT(*) as count
      FROM entrepreneurs
      WHERE year = ${year}
      GROUP BY academic
    `)[0];
    
    if (academicResult) {
      data.academicDistribution = academicResult.values.map((row: any[]) => ({
        name: row[0],
        value: row[1]
      }));
    }

    // Program distribution
    const programResult = db.exec(`
      SELECT program, COUNT(*) as count
      FROM entrepreneurs
      WHERE year = ${year}
      GROUP BY program
    `)[0];
    
    if (programResult) {
      data.programDistribution = programResult.values.map((row: any[]) => ({
        name: row[0].toUpperCase(),
        value: row[1]
      }));
    }

    // Business type distribution
    const businessTypeResult = db.exec(`
      SELECT business_type, COUNT(*) as count
      FROM entrepreneurs
      WHERE year = ${year}
      GROUP BY business_type
    `)[0];
    
    if (businessTypeResult) {
      data.businessTypeDistribution = businessTypeResult.values.map((row: any[]) => ({
        name: row[0].charAt(0).toUpperCase() + row[0].slice(1),
        value: row[1]
      }));
    }

    // District distribution
    const districtResult = db.exec(`
      SELECT district, COUNT(*) as count
      FROM entrepreneurs
      WHERE year = ${year}
      GROUP BY district
      ORDER BY count DESC
      LIMIT 10
    `)[0];
    
    if (districtResult) {
      data.districtDistribution = districtResult.values.map((row: any[]) => ({
        district: row[0].replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        count: row[1]
      }));
    }

    return data;
  } catch (error) {
    console.error('Error getting report data:', error);
    return null;
  }
}

export async function exportReportData(year: string) {
  await initDB();
  
  try {
    const result = db.exec(`
      SELECT 
        name,
        ic_number,
        gender,
        race,
        academic,
        phone,
        company_name,
        address,
        email,
        district,
        business_type,
        business_field,
        agency,
        employee_count,
        program,
        premise_lot,
        location,
        monthly_income,
        business_status,
        year
      FROM entrepreneurs
      WHERE year = ${year}
      ORDER BY name ASC
    `);

    if (!result[0]) return null;

    const headers = [
      'Name',
      'IC Number',
      'Gender',
      'Race',
      'Academic',
      'Phone',
      'Company Name',
      'Address',
      'Email',
      'District',
      'Business Type',
      'Business Field',
      'Agency',
      'Employee Count',
      'Program',
      'Premise Lot',
      'Location',
      'Monthly Income',
      'Business Status',
      'Year'
    ].join(',');

    const rows = result[0].values.map((row: any[]) => 
      row.map((value: any) => `"${value}"`).join(',')
    );

    return `${headers}\n${rows.join('\n')}`;
  } catch (error) {
    console.error('Error exporting report data:', error);
    return null;
  }
}